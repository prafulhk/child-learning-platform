import { Component, OnInit, inject, signal } from '@angular/core';

import {
  CatalogApiService,
  Subject,
  SubjectInput,
} from '../../core/services/catalog-api.service';
import { ToastService } from '../../core/services/toast';

@Component({
  selector: 'app-admin-subjects',
  standalone: true,
  templateUrl: './admin-subjects.component.html',
})
export class AdminSubjectsComponent implements OnInit {
  private readonly catalogApi = inject(CatalogApiService);
  private readonly toastService = inject(ToastService);

  readonly subjects = signal<Subject[]>([]);
  readonly isLoading = signal(false);
  readonly isSaving = signal(false);
  readonly editingSubjectId = signal<string | null>(null);

  readonly name = signal('');
  readonly code = signal('');
  readonly description = signal('');
  readonly sortOrder = signal(0);

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.isLoading.set(true);
    this.catalogApi.getAdminSubjects().subscribe({
      next: (subjects) => {
        this.subjects.set(subjects);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.toastService.error(error?.error?.message ?? 'Unable to load subjects.');
      },
    });
  }

  startCreate(): void {
    this.resetForm();
  }

  startEdit(subject: Subject): void {
    this.editingSubjectId.set(subject._id);
    this.name.set(subject.name);
    this.code.set(subject.code);
    this.description.set(subject.description ?? '');
    this.sortOrder.set(subject.sortOrder);
  }

  cancelEdit(): void {
    this.resetForm();
  }

  save(): void {
    const name = this.name().trim();
    const code = this.code().trim();
    const description = this.description().trim();
    const sortOrder = this.sortOrder();

    if (name.length < 2 || code.length < 1) {
      this.toastService.error('Subject name and code are required.');
      return;
    }

    const input: SubjectInput = {
      name,
      code,
      ...(description ? { description } : {}),
      sortOrder: Number.isFinite(sortOrder) && sortOrder >= 0 ? sortOrder : 0,
    };

    this.isSaving.set(true);
    const editingId = this.editingSubjectId();
    const request = editingId
      ? this.catalogApi.updateSubject(editingId, input)
      : this.catalogApi.createSubject(input);

    request.subscribe({
      next: (subject) => {
        if (editingId) {
          this.subjects.update((subjects) =>
            subjects.map((current) => (current._id === subject._id ? subject : current)),
          );
          this.toastService.success('Subject updated successfully.');
        } else {
          this.subjects.update((subjects) => [...subjects, subject]);
          this.toastService.success('Subject created successfully.');
        }
        this.isSaving.set(false);
        this.resetForm();
        this.sortSubjects();
      },
      error: (error) => {
        this.isSaving.set(false);
        this.toastService.error(error?.error?.message ?? 'Unable to save subject.');
      },
    });
  }

  toggleStatus(subject: Subject): void {
    const nextStatus = subject.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    this.catalogApi.updateSubjectStatus(subject._id, nextStatus).subscribe({
      next: (updatedSubject) => {
        this.subjects.update((subjects) =>
          subjects.map((current) =>
            current._id === updatedSubject._id ? updatedSubject : current,
          ),
        );
        this.toastService.success(
          `${updatedSubject.name} is now ${updatedSubject.status.toLowerCase()}.`,
        );
      },
      error: (error) => {
        this.toastService.error(error?.error?.message ?? 'Unable to update subject status.');
      },
    });
  }

  trackById(_index: number, subject: Subject): string {
    return subject._id;
  }

  private resetForm(): void {
    this.editingSubjectId.set(null);
    this.name.set('');
    this.code.set('');
    this.description.set('');
    this.sortOrder.set(0);
  }

  private sortSubjects(): void {
    this.subjects.update((subjects) =>
      [...subjects].sort(
        (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name),
      ),
    );
  }
}
