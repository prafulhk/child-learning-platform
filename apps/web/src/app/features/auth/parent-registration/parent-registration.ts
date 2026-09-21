import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { AuthService } from '../../../core/services/auth';

const passwordsMatchValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (!password || !confirmPassword) {
    return null;
  }

  return password === confirmPassword ? null : { passwordMismatch: true };
};

@Component({
  selector: 'app-parent-registration',
  imports: [ReactiveFormsModule],
  templateUrl: './parent-registration.html',
  styleUrl: './parent-registration.scss',
})
export class ParentRegistration {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly registrationForm = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: passwordsMatchValidator,
    },
  );

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.registrationForm.getRawValue()).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.message;
        this.registrationForm.reset();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error?.error?.message ?? 'Unable to create account';
      },
    });
  }
}
