import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  computed,
  inject,
  signal,
} from '@angular/core';
import { forkJoin, finalize } from 'rxjs';

import { ActiveChildService } from '../../core/services/active-child.service';
import {
  CatalogApiService,
  type Subject,
  type Topic,
} from '../../core/services/catalog-api.service';
import {
  LearningSessionsApiService,
  type LearningSession,
} from '../../core/services/learning-sessions-api.service';

@Component({
  selector: 'app-learning-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './learning-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearningHistoryComponent implements OnInit {
  private readonly learningSessionsApiService = inject(LearningSessionsApiService);
  private readonly activeChildService = inject(ActiveChildService);
  private readonly catalogApiService = inject(CatalogApiService);

  @Output()
  readonly backToHome = new EventEmitter<void>();

  readonly learningSessions = signal<LearningSession[]>([]);
  readonly subjects = signal<Subject[]>([]);
  readonly topics = signal<Topic[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  readonly subjectNameById = computed(() => {
    return new Map(this.subjects().map((subject) => [subject._id, subject.name]));
  });

  readonly topicNameById = computed(() => {
    return new Map(this.topics().map((topic) => [topic._id, topic.name]));
  });

  readonly totalSessions = computed(() => this.learningSessions().length);

  readonly totalLearningMinutes = computed(() =>
    this.learningSessions().reduce((total, session) => total + session.durationMinutes, 0),
  );

  readonly averageAccuracy = computed(() => {
    const sessionsWithAccuracy = this.learningSessions().filter(
      (session) => session.accuracy !== undefined,
    );

    if (sessionsWithAccuracy.length === 0) {
      return null;
    }

    const totalPercentage = sessionsWithAccuracy.reduce(
      (total, session) => total + (session.accuracy?.percentage ?? 0),
      0,
    );

    return Math.round(totalPercentage / sessionsWithAccuracy.length);
  });

  ngOnInit(): void {
    this.loadLearningHistory();
  }

  private loadLearningHistory(): void {
    const activeChild = this.activeChildService.activeChild();

    if (!activeChild) {
      this.errorMessage.set('Please select a child to view learning history.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.learningSessionsApiService
      .getLearningSessions({
        childId: activeChild._id,
        page: 1,
        limit: 20,
      })
      .subscribe({
        next: (response) => {
          this.learningSessions.set(response.sessions);
          this.loadCatalogData(response.sessions);
        },
        error: () => {
          this.learningSessions.set([]);
          this.errorMessage.set('Unable to load learning history. Please try again.');
          this.isLoading.set(false);
        },
      });
  }

  private loadCatalogData(sessions: LearningSession[]): void {
    if (sessions.length === 0) {
      this.isLoading.set(false);
      return;
    }

    this.catalogApiService
      .getSubjects()
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: (subjects) => {
          this.subjects.set(subjects);
          this.loadTopicsForSessions(sessions, subjects);
        },
        error: () => {
          this.errorMessage.set('Unable to load learning subject information.');
        },
      });
  }

  private loadTopicsForSessions(sessions: LearningSession[], subjects: Subject[]): void {
    const subjectIds = [...new Set(sessions.map((session) => session.subjectId))];

    const validSubjectIds = subjectIds.filter((subjectId) =>
      subjects.some((subject) => subject._id === subjectId),
    );

    if (validSubjectIds.length === 0) {
      return;
    }

    forkJoin(
      validSubjectIds.map((subjectId) => this.catalogApiService.getTopics(subjectId)),
    ).subscribe({
      next: (topicGroups) => {
        this.topics.set(topicGroups.flat());
      },
      error: () => {
        this.errorMessage.set('Unable to load learning topic information.');
      },
    });
  }

  getSubjectName(subjectId: string): string {
    return this.subjectNameById().get(subjectId) ?? subjectId;
  }

  getTopicName(topicId: string): string {
    return this.topicNameById().get(topicId) ?? topicId;
  }
}
