import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, LoginResponse } from '../../../core/services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  readonly registerRequested = output<void>();
  readonly loginSuccess = output<LoginResponse>();
  readonly registrationMessage = this.authService.registrationMessage;

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  isLoading = signal(false);
  errorMessage = signal('');
  showPassword = false;

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: (response) => {
        this.isLoading.set(false);

        this.loginSuccess.emit(response);
      },

      error: (error) => {
        this.isLoading.set(false);

        if (error.status === 401) {
          this.errorMessage.set('Incorrect email or password. Please try again.');
        } else if (error.status === 0) {
          this.errorMessage.set('Unable to connect to the server. Please check your connection.');
        } else {
          this.errorMessage.set(error?.error?.message ?? 'Unable to login. Please try again.');
        }
      },
    });
  }
}
