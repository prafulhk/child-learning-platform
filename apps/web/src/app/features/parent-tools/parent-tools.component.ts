import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';

import { Child, ChildService } from '../../core/services/child.service';
import { ToastService } from '../../core/services/toast';
import { ActiveChildService } from '../../core/services/active-child.service';

export type ParentToolsChildSelectionDestination =
  'LOG_LEARNING' | 'LEARNING_HISTORY' | 'CREATE_LESSON_PLAN';

@Component({
  selector: 'app-parent-tools',
  standalone: true,
  templateUrl: './parent-tools.component.html',
})
export class ParentToolsComponent implements OnInit {
  private readonly childService = inject(ChildService);
  private readonly toastService = inject(ToastService);
  private readonly activeChildService = inject(ActiveChildService);

  @Input()
  childSelectionDestination: ParentToolsChildSelectionDestination = 'LOG_LEARNING';

  @Output() openQuestionBank = new EventEmitter<void>();
  @Output() backToHome = new EventEmitter<void>();
  @Output() openLogLearning = new EventEmitter<void>();
  @Output() openLearningHistory = new EventEmitter<void>();
  @Output() openCreateLessonPlan = new EventEmitter<void>();

  readonly children = signal<Child[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly childName = signal('');
  readonly childGrade = signal('');
  readonly isCreatingChild = signal(false);

  ngOnInit(): void {
    this.loadChildren();
  }

  private loadChildren(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.childService.getChildren().subscribe({
      next: (response) => {
        this.children.set(response.children);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load child profile.');
        this.isLoading.set(false);

        this.toastService.error('Unable to load child profile.');
      },
    });
  }

  onChildNameChange(value: string): void {
    this.childName.set(value);
  }

  onChildGradeChange(value: string): void {
    this.childGrade.set(value);
  }

  onOpenQuestionBank(): void {
    this.openQuestionBank.emit();
  }

  onBackToHome(): void {
    this.backToHome.emit();
  }

  onCreateChild(): void {
    const name = this.childName().trim();
    const grade = this.childGrade().trim();

    if (name.length < 2) {
      this.toastService.error('Child name must be at least 2 characters.');
      return;
    }

    this.isCreatingChild.set(true);

    this.childService
      .createChild({
        name,
        ...(grade ? { grade } : {}),
      })
      .subscribe({
        next: (response) => {
          this.children.update((currentChildren) => [response.child, ...currentChildren]);

          this.childName.set('');
          this.childGrade.set('');
          this.isCreatingChild.set(false);

          this.toastService.success(`${response.child.name} added successfully!`);
        },

        error: (error) => {
          this.toastService.error(error?.error?.message ?? 'Unable to create child profile.');

          this.isCreatingChild.set(false);
        },
      });
  }

  onSelectChild(child: Child): void {
    this.activeChildService.setActiveChild(child);

    this.toastService.success(`${child.name} selected.`);

    if (this.childSelectionDestination === 'LEARNING_HISTORY') {
      this.openLearningHistory.emit();
      return;
    }

    if (this.childSelectionDestination === 'CREATE_LESSON_PLAN') {
      this.openCreateLessonPlan.emit();
      return;
    }

    this.openLogLearning.emit();
  }
}
