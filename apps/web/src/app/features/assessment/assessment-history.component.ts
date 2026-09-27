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

import {
  AttemptsApiService,
  type AttemptType,
  type BackendAttempt,
} from '../../core/services/attempts-api.service';
import { CommonModule } from '@angular/common';

type AssessmentHistoryFilter = 'ALL' | 'PRACTICE' | 'OLYMPIAD';

@Component({
  selector: 'app-assessment-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assessment-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssessmentHistoryComponent implements OnInit {
  private readonly attemptsApiService = inject(AttemptsApiService);

  @Output() readonly backToHome = new EventEmitter<void>();

  readonly attempts = signal<BackendAttempt[]>([]);
  readonly selectedFilter = signal<AssessmentHistoryFilter>('ALL');
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  readonly filteredAttempts = computed(() => {
    const filter = this.selectedFilter();

    if (filter === 'ALL') {
      return this.attempts();
    }

    const attemptType: AttemptType = filter === 'PRACTICE' ? 'PRACTICE' : 'ASSESSMENT';

    return this.attempts().filter((attempt) => attempt.attemptType === attemptType);
  });

  readonly totalAttempts = computed(() => this.attempts().length);

  readonly practiceCount = computed(
    () => this.attempts().filter((attempt) => attempt.attemptType === 'PRACTICE').length,
  );

  readonly olympiadCount = computed(
    () => this.attempts().filter((attempt) => attempt.attemptType === 'ASSESSMENT').length,
  );

  readonly averageAccuracy = computed(() => {
    const items = this.filteredAttempts();

    if (items.length === 0) {
      return 0;
    }

    const totalQuestions = items.reduce(
      (total, attempt) => total + attempt.result.totalQuestions,
      0,
    );

    const totalCorrect = items.reduce((total, attempt) => total + attempt.result.correctCount, 0);

    if (totalQuestions === 0) {
      return 0;
    }

    return Math.round((totalCorrect / totalQuestions) * 100);
  });

  ngOnInit(): void {
    this.loadAttempts();
  }

  setFilter(filter: AssessmentHistoryFilter): void {
    this.selectedFilter.set(filter);
  }

  private loadAttempts(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.attemptsApiService.getAttempts(undefined, 1, 100).subscribe({
      next: (response) => {
        this.attempts.set(
          [...response.attempts].sort(
            (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
          ),
        );

        this.isLoading.set(false);
      },

      error: () => {
        this.attempts.set([]);
        this.errorMessage.set('Unable to load assessment history. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  getAttemptTitle(attempt: BackendAttempt): string {
    if (attempt.attemptType === 'ASSESSMENT') {
      return attempt.title ?? 'Abacus Olympiad Test';
    }

    return `Practice - ${attempt.topicId ?? 'General'}`;
  }

  getAttemptTypeLabel(attempt: BackendAttempt): string {
    return attempt.attemptType === 'ASSESSMENT' ? 'Olympiad' : 'Practice';
  }

  getAttemptIcon(attempt: BackendAttempt): string {
    return attempt.attemptType === 'ASSESSMENT' ? '🏆' : '🧮';
  }
}
