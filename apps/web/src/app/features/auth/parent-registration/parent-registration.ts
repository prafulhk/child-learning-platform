import { Component, inject, output, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

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
  readonly loginRequested = output<void>();
  readonly registrationCompleted = output<string>();

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

  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = '';

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage = '';

    this.authService.register(this.registrationForm.getRawValue()).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.registrationForm.reset();
        this.authService.setRegistrationMessage(response.message);
        this.registrationCompleted.emit(response.message);
        this.loginRequested.emit();
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error?.error?.message ?? 'Unable to create account');
      },
    });
  }
}
