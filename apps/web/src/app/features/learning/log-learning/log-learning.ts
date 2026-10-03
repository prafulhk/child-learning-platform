import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  CatalogApiService,
  type Subject,
  type Topic,
} from '../../../core/services/catalog-api.service';
import { ActiveChildService } from '../../../core/services/active-child.service';
import { ChildService } from '../../../core/services/child.service';
import { LearningSessionsApiService } from '../../../core/services/learning-sessions-api.service';
import { LessonPlanApi } from '../../../core/services/lesson-plan-api.service';
import { ToastService } from '../../../core/services/toast';

@Component({
  selector: 'app-log-learning',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './log-learning.html',
})
export class LogLearningComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly catalogApiService = inject(CatalogApiService);
  private readonly activeChildService = inject(ActiveChildService);
  private readonly childService = inject(ChildService);
  private readonly learningSessionsApiService = inject(LearningSessionsApiService);
  private readonly lessonPlanApi = inject(LessonPlanApi);
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  @Output()
  readonly backToHome = new EventEmitter<void>();

  readonly subjects = signal<Subject[]>([]);
  readonly topics = signal<Topic[]>([]);
  readonly isLoadingSubjects = signal(false);
  readonly isLoadingTopics = signal(false);
  readonly isSaving = signal(false);
  readonly errorMessage = signal('');
  readonly lessonPlanId = signal('');
  readonly lessonPlanActivity = signal('');

  readonly learningForm = this.formBuilder.nonNullable.group({
    subjectId: ['', Validators.required],
    topicId: [{ value: '', disabled: true }, Validators.required],
    learningDate: [this.getTodayDate(), Validators.required],
    durationMinutes: [30, [Validators.required, Validators.min(1)]],
    whatWasTaught: ['', [Validators.required, Validators.minLength(1)]],
    performance: ['', Validators.required],
    accuracy: [null as number | null, [Validators.min(0), Validators.max(100)]],
    notes: [''],
  });

  ngOnInit(): void {
    this.loadSubjects();
    this.initializeLessonPlanContext();
  }

  onSubjectChange(): void {
    const subjectId = this.learningForm.controls.subjectId.value;

    this.learningForm.controls.topicId.reset('');
    this.learningForm.controls.topicId.disable();
    this.topics.set([]);

    if (!subjectId) {
      return;
    }

    this.loadTopics(subjectId);
  }

  onSave(): void {
    if (this.isSaving()) {
      return;
    }

    if (this.learningForm.invalid) {
      this.learningForm.markAllAsTouched();
      return;
    }

    const activeChild = this.activeChildService.activeChild();

    if (!activeChild) {
      this.toastService.error('Please select a child before logging learning.');
      return;
    }

    const formValue = this.learningForm.getRawValue();

    this.isSaving.set(true);
    this.errorMessage.set('');

    this.learningSessionsApiService
      .createLearningSession({
        childId: activeChild._id,
        subjectId: formValue.subjectId,
        topicId: formValue.topicId,
        lessonPlanId: this.lessonPlanId() || undefined,
        learningDate: new Date(`${formValue.learningDate}T00:00:00`).toISOString(),
        durationMinutes: formValue.durationMinutes,
        whatWasTaught: formValue.whatWasTaught.trim(),
        performance: formValue.performance,
        accuracy:
          formValue.accuracy === null
            ? undefined
            : {
                correct: formValue.accuracy,
                total: 100,
                percentage: formValue.accuracy,
              },
        notes: formValue.notes.trim() || undefined,
      })
      .subscribe({
        next: () => {
          this.isSaving.set(false);

          if (this.lessonPlanId()) {
            this.toastService.success('Lesson plan marked completed.');
            void this.router.navigate(['/lesson-planning', this.lessonPlanId()]);
            return;
          }

          this.toastService.success('Learning saved successfully.');

          this.backToHome.emit();
        },
        error: (error) => {
          this.isSaving.set(false);

          this.errorMessage.set(
            error?.error?.message ?? 'Unable to save learning. Please try again.',
          );

          this.toastService.error(
            error?.error?.message ?? 'Unable to save learning. Please try again.',
          );
        },
      });
  }

  private loadSubjects(): void {
    this.isLoadingSubjects.set(true);
    this.errorMessage.set('');

    this.catalogApiService.getSubjects().subscribe({
      next: (subjects) => {
        this.subjects.set(subjects);
        this.isLoadingSubjects.set(false);
        this.applyLessonPlanSubject();
      },
      error: () => {
        this.errorMessage.set('Unable to load subjects. Please try again.');
        this.isLoadingSubjects.set(false);
      },
    });
  }

  private loadTopics(subjectId: string, topicIdToSelect?: string): void {
    this.isLoadingTopics.set(true);
    this.errorMessage.set('');

    this.catalogApiService.getTopics(subjectId).subscribe({
      next: (topics) => {
        this.topics.set(topics);
        this.learningForm.controls.topicId.enable();

        if (topicIdToSelect && topics.some((topic) => topic._id === topicIdToSelect)) {
          this.learningForm.controls.topicId.setValue(topicIdToSelect);
        }

        this.isLoadingTopics.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load topics. Please try again.');
        this.isLoadingTopics.set(false);
      },
    });
  }

  private initializeLessonPlanContext(): void {
    const planId = this.route.snapshot.queryParamMap.get('lessonPlanId');

    if (!planId) {
      return;
    }

    this.lessonPlanApi.getLessonPlanById(planId).subscribe({
      next: (response) => {
        const lessonPlan = response.data ?? response.lessonPlan;

        if (!lessonPlan || lessonPlan.status !== 'PLANNED') {
          this.errorMessage.set('This lesson plan is no longer available to complete.');
          return;
        }

        this.lessonPlanId.set(lessonPlan._id);
        this.lessonPlanActivity.set(lessonPlan.plannedActivity);

        this.learningForm.patchValue({
          learningDate: this.getTodayDate(),
          durationMinutes: lessonPlan.plannedDurationMinutes,
          whatWasTaught: lessonPlan.plannedActivity,
        });

        const activeChild = this.activeChildService.activeChild();
        if (activeChild?._id === lessonPlan.childId) {
          this.applyLessonPlanSubject();
          return;
        }

        this.childService.getChildren().subscribe({
          next: (childrenResponse) => {
            const child = childrenResponse.children.find(
              (item) => item._id === lessonPlan.childId,
            );

            if (!child) {
              this.errorMessage.set('Unable to select the lesson plan child.');
              return;
            }

            this.activeChildService.setActiveChild(child);
            this.applyLessonPlanSubject();
          },
          error: () => {
            this.errorMessage.set('Unable to load the lesson plan child.');
          },
        });
      },
      error: (error) => {
        this.errorMessage.set(
          error?.error?.message ?? 'Unable to load the lesson plan.',
        );
      },
    });
  }

  private applyLessonPlanSubject(): void {
    const planId = this.lessonPlanId();

    if (!planId) {
      return;
    }

    this.lessonPlanApi.getLessonPlanById(planId).subscribe({
      next: (response) => {
        const lessonPlan = response.data ?? response.lessonPlan;

        if (!lessonPlan) {
          return;
        }

        if (!this.subjects().some((subject) => subject._id === lessonPlan.subjectId)) {
          return;
        }

        this.learningForm.controls.subjectId.setValue(lessonPlan.subjectId);
        this.loadTopics(lessonPlan.subjectId, lessonPlan.topicId);
      },
    });
  }

  private getTodayDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
