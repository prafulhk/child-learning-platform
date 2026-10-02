import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { ParentToolsChildSelectionDestination } from './features/parent-tools/parent-tools.component';
import { AuthService, LoginResponse } from './core/services/auth.service';
import { ToastContainerComponent } from './shared/components/toast-container/toast-container';

type AppView =
  | 'HOME'
  | 'LOGIN'
  | 'DETAIL'
  | 'PARENT_TOOLS'
  | 'QUESTION_BANK'
  | 'REGISTER'
  | 'CREATE_LESSON_PLAN';

@Component({
  imports: [RouterOutlet, ToastContainerComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  view: AppView = this.authService.currentUser() ? 'HOME' : 'LOGIN';
  parentToolsChildSelectionDestination: ParentToolsChildSelectionDestination = 'LOG_LEARNING';

  constructor() {
    this.authService.restoreSession().subscribe({
      next: () => {
        this.view = 'HOME';
      },
      complete: () => {
        if (!this.authService.currentUser()) {
          this.view = 'LOGIN';
        }
      },
    });
  }

  onOpenLogin(): void {
    this.view = 'LOGIN';
    void this.router.navigate(['/login']);
  }

  onLoginSuccess(_response: LoginResponse): void {
    this.view = 'HOME';
    void this.router.navigate(['/dashboard']);
  }

  onBackToHome(): void {
    this.view = 'HOME';
  }

  onOpenRegistration(): void {
    this.view = 'REGISTER';
    void this.router.navigate(['/register']);
  }

  onOpenParentTools(): void {
    this.parentToolsChildSelectionDestination = 'LOG_LEARNING';
    this.view = 'PARENT_TOOLS';
  }

  onOpenQuestionBank(): void {
    this.view = 'QUESTION_BANK';
  }

  onBackToParentTools(): void {
    this.view = 'PARENT_TOOLS';
  }

  onOpenCreateLessonPlan(): void {
    this.view = 'CREATE_LESSON_PLAN';
  }

  onDashboardCreateLessonPlan(): void {
    this.parentToolsChildSelectionDestination = 'CREATE_LESSON_PLAN';
    this.view = 'PARENT_TOOLS';
  }
}
