import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ActiveChildService } from '../../../core/services/active-child.service';
import { CatalogApiService, Subject, Topic } from '../../../core/services/catalog-api.service';
import {
  CreateLessonPlanRequest,
  LessonPlanApi,
} from '../../../core/services/lesson-plan-api.service';

@Component({
  selector: 'app-create-lesson-plan',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-lesson-plan.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateLessonPlan implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly catalogService = inject(CatalogApiService);

  readonly activeChildService = inject(ActiveChildService);
  private readonly lessonPlanApiService = inject(LessonPlanApi);

  @Output() readonly backToHome = new EventEmitter<void>();
  @Output() readonly saved = new EventEmitter<void>();

  readonly subjects = signal<Subject[]>([]);
  readonly topics = signal<Topic[]>([]);

  readonly isLoadingSubjects = signal(false);
  readonly isLoadingTopics = signal(false);

  readonly errorMessage = signal('');

  readonly isSaving = signal(false);

  readonly lessonPlanForm = this.formBuilder.nonNullable.group({
    subjectId: ['', Validators.required],
    topicId: ['', Validators.required],
    plannedDate: [this.getTodayDate(), Validators.required],
    plannedActivity: ['', [Validators.required, Validators.minLength(1)]],
    plannedDurationMinutes: [30, [Validators.required, Validators.min(0)]],
    notes: [''],
  });

  ngOnInit(): void {
    this.loadSubjects();
  }

  onSubjectChange(): void {
    const subjectId = this.lessonPlanForm.controls.subjectId.value;

    this.topics.set([]);
    this.lessonPlanForm.controls.topicId.setValue('');
    this.lessonPlanForm.controls.topicId.disable();

    if (!subjectId) {
      return;
    }

    this.loadTopics(subjectId);
  }

  onSave(): void {
    if (this.lessonPlanForm.invalid) {
      this.lessonPlanForm.markAllAsTouched();
      return;
    }

    const child = this.activeChildService.activeChild();

    if (!child) {
      this.errorMessage.set('Please select a child before creating a lesson plan.');
      return;
    }

    const formValue = this.lessonPlanForm.getRawValue();

    const payload: CreateLessonPlanRequest = {
      childId: child._id,
      plannedDate: new Date(`${formValue.plannedDate}T00:00:00`).toISOString(),
      subjectId: formValue.subjectId,
      topicId: formValue.topicId,
      plannedActivity: formValue.plannedActivity.trim(),
      plannedDurationMinutes: formValue.plannedDurationMinutes,
      ...(formValue.notes.trim() ? { notes: formValue.notes.trim() } : {}),
    };

    this.isSaving.set(true);
    this.errorMessage.set('');

    this.lessonPlanApiService.createLessonPlan(payload).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.saved.emit();
      },

      error: (error) => {
        this.isSaving.set(false);

        this.errorMessage.set(
          error?.error?.message ?? 'Unable to create lesson plan. Please try again.',
        );
      },
    });
  }

  onBack(): void {
    this.backToHome.emit();
  }

  private loadSubjects(): void {
    this.isLoadingSubjects.set(true);
    this.errorMessage.set('');

    this.catalogService.getSubjects().subscribe({
      next: (subjects) => {
        this.subjects.set(subjects);
        this.isLoadingSubjects.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load subjects.');
        this.isLoadingSubjects.set(false);
      },
    });
  }

  private loadTopics(subjectId: string): void {
    this.isLoadingTopics.set(true);
    this.errorMessage.set('');

    this.catalogService.getTopics(subjectId).subscribe({
      next: (topics) => {
        this.topics.set(topics);
        this.lessonPlanForm.controls.topicId.enable();
        this.isLoadingTopics.set(false);
      },
      error: () => {
        this.topics.set([]);
        this.errorMessage.set('Unable to load topics.');
        this.isLoadingTopics.set(false);
      },
    });
  }

  private getTodayDate(): string {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
