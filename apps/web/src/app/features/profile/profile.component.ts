import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  template: `
    <div class="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl">
        <div class="mb-6 flex items-center justify-between gap-4">
          <div>
            <p class="text-sm font-semibold text-indigo-600">Account</p>
            <h1 class="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              My Profile
            </h1>
            <p class="mt-1 text-sm text-slate-600">
              View and update your account information.
            </p>
          </div>

          <button
            type="button"
            class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            (click)="onBack()"
          >
            Back
          </button>
        </div>

        @if (currentUser(); as user) {
          <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div class="mb-8 flex items-center gap-4 border-b border-slate-100 pb-6">
              <div class="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-700">
                {{ user.name.charAt(0).toUpperCase() }}
              </div>
              <div>
                <h2 class="text-lg font-bold text-slate-900">Account information</h2>
                <p class="text-sm text-slate-500">Your account details are shown below.</p>
              </div>
            </div>

            <form (ngSubmit)="onSave()" #profileForm="ngForm" class="space-y-6">
              <div>
                <label for="profile-name" class="mb-2 block text-sm font-semibold text-slate-700">
                  Name
                </label>
                <input
                  id="profile-name"
                  name="name"
                  type="text"
                  required
                  minlength="2"
                  maxlength="100"
                  [(ngModel)]="name"
                  #nameField="ngModel"
                  class="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
                @if (nameField.invalid && nameField.touched) {
                  <p class="mt-2 text-sm text-red-600">Name must be at least 2 characters.</p>
                }
              </div>

              <div>
                <label for="profile-email" class="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>
                <input
                  id="profile-email"
                  type="email"
                  [value]="user.email"
                  disabled
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
                />
                <p class="mt-2 text-xs text-slate-500">Email is your account identifier and cannot be changed here.</p>
              </div>

              <div>
                <label for="profile-role" class="mb-2 block text-sm font-semibold text-slate-700">
                  Role
                </label>
                <input
                  id="profile-role"
                  type="text"
                  [value]="user.role"
                  disabled
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
                />
              </div>

              @if (errorMessage) {
                <div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                  {{ errorMessage }}
                </div>
              }

              @if (successMessage) {
                <div class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">
                  {{ successMessage }}
                </div>
              }

              <div class="flex justify-end border-t border-slate-100 pt-6">
                <button
                  type="submit"
                  [disabled]="profileForm.invalid || saving"
                  class="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {{ saving ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </section>
        }
      </div>
    </div>
  `,
})
export class ProfileComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly currentUser = this.authService.currentUser;
  name = this.currentUser()?.name ?? '';
  saving = false;
  errorMessage = '';
  successMessage = '';

  onSave(): void {
    const trimmedName = this.name.trim();

    if (trimmedName.length < 2) {
      this.errorMessage = 'Name must be at least 2 characters.';
      this.successMessage = '';
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.updateProfile({ name: trimmedName }).subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = 'Profile updated successfully.';
      },
      error: (error: { error?: { message?: string }; message?: string }) => {
        this.saving = false;
        this.errorMessage =
          error.error?.message ?? error.message ?? 'Unable to update your profile.';
      },
    });
  }

  onBack(): void {
    void this.router.navigate(['/dashboard']);
  }
}
