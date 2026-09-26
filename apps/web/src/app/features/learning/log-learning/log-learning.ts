import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  CatalogApiService,
  type Subject,
  type Topic,
} from '../../../core/services/catalog-api.service';
import { ActiveChildService } from '../../../core/services/active-child.service';
import { LearningSessionsApiService } from '../../../core/services/learning-sessions-api.service';
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
  private readonly learningSessionsApiService = inject(LearningSessionsApiService);
  private readonly toastService = inject(ToastService);

  @Output()
  readonly backToHome = new EventEmitter<void>();

  readonly subjects = signal<Subject[]>([]);
  readonly topics = signal<Topic[]>([]);
  readonly isLoadingSubjects = signal(false);
  readonly isLoadingTopics = signal(false);
  readonly isSaving = signal(false);
  readonly errorMessage = signal('');

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
        learningDate: new Date(`${formValue.learningDate}T00:00:00`).toISOString(),
        durationMinutes: formValue.durationMinutes,
        whatWasTaught: formValue.whatWasTaught.trim(),
        performance: formValue.performance,
        notes: formValue.notes.trim() || undefined,
      })
      .subscribe({
        next: () => {
          this.isSaving.set(false);

          this.toastService.success('Learning saved successfully.');

          this.backToHome.emit();
        },
        error: () => {
          this.isSaving.set(false);

          this.errorMessage.set('Unable to save learning. Please try again.');

          this.toastService.error('Unable to save learning. Please try again.');
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
      },
      error: () => {
        this.errorMessage.set('Unable to load subjects. Please try again.');
        this.isLoadingSubjects.set(false);
      },
    });
  }

  private loadTopics(subjectId: string): void {
    this.isLoadingTopics.set(true);
    this.errorMessage.set('');

    this.catalogApiService.getTopics(subjectId).subscribe({
      next: (topics) => {
        this.topics.set(topics);
        this.learningForm.controls.topicId.enable();
        this.isLoadingTopics.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load topics. Please try again.');
        this.isLoadingTopics.set(false);
      },
    });
  }

  private getTodayDate(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
