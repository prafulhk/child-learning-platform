import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { ActiveChildService } from '../../core/services/active-child.service';
import { Child, ChildService } from '../../core/services/child.service';
import { ToastService } from '../../core/services/toast';

@Component({
  selector: 'app-parent-tools',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './parent-tools.component.html',
})
export class ParentToolsComponent implements OnInit {
  private readonly childService = inject(ChildService);
  private readonly toastService = inject(ToastService);
  private readonly activeChildService = inject(ActiveChildService);
  private readonly router = inject(Router);

  readonly children = signal<Child[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly childName = signal('');
  readonly childGrade = signal('');
  readonly isCreatingChild = signal(false);

  readonly editingChildId = signal<string | null>(null);
  readonly editChildName = signal('');
  readonly editChildDateOfBirth = signal('');
  readonly editChildGrade = signal('');
  readonly isUpdatingChild = signal(false);

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

  onEditChildNameChange(value: string): void {
    this.editChildName.set(value);
  }

  onEditChildDateOfBirthChange(value: string): void {
    this.editChildDateOfBirth.set(value);
  }

  onEditChildGradeChange(value: string): void {
    this.editChildGrade.set(value);
  }

  onStartEditChild(child: Child): void {
    this.editingChildId.set(child._id);
    this.editChildName.set(child.name);
    this.editChildDateOfBirth.set(child.dateOfBirth ? child.dateOfBirth.slice(0, 10) : '');
    this.editChildGrade.set(child.grade ?? '');
  }

  onCancelEditChild(): void {
    this.editingChildId.set(null);
    this.editChildName.set('');
    this.editChildDateOfBirth.set('');
    this.editChildGrade.set('');
    this.isUpdatingChild.set(false);
  }

  onUpdateChild(child: Child): void {
    const name = this.editChildName().trim();
    const grade = this.editChildGrade().trim();
    const dateOfBirth = this.editChildDateOfBirth();

    if (name.length < 2) {
      this.toastService.error('Child name must be at least 2 characters.');
      return;
    }

    this.isUpdatingChild.set(true);

    this.childService
      .updateChild(child._id, {
        name,
        ...(dateOfBirth ? { dateOfBirth } : {}),
        ...(grade ? { grade } : {}),
      })
      .subscribe({
        next: (response) => {
          this.children.update((currentChildren) =>
            currentChildren.map((currentChild) =>
              currentChild._id === response.child._id ? response.child : currentChild,
            ),
          );

          const activeChild = this.activeChildService.activeChild();
          if (activeChild?._id === response.child._id) {
            this.activeChildService.setActiveChild(response.child);
          }

          this.toastService.success(`${response.child.name} updated successfully!`);
          this.onCancelEditChild();
        },
        error: (error) => {
          this.toastService.error(error?.error?.message ?? 'Unable to update child profile.');
          this.isUpdatingChild.set(false);
        },
      });
  }

  onOpenQuestionBank(): void {
    void this.router.navigate(['/parent-tools/question-bank']);
  }

  onBackToHome(): void {
    void this.router.navigate(['/dashboard']);
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
  }
}
