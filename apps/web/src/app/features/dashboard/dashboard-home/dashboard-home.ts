import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ActiveChildService } from '../../../core/services/active-child.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  imports: [],
  selector: 'app-dashboard-home',
  styleUrl: './dashboard-home.scss',
  templateUrl: './dashboard-home.html',
})
export class DashboardHome {
  private readonly authService = inject(AuthService);
  private readonly activeChildService = inject(ActiveChildService);
  private readonly router = inject(Router);

  readonly currentUser = this.authService.currentUser;
  readonly activeChild = this.activeChildService.activeChild;

  onOpenLogin(): void {
    void this.router.navigate(['/login']);
  }

  onStartPractice(): void {
    if (!this.activeChild()) {
      void this.router.navigate(['/parent-tools']);
      return;
    }

    void this.router.navigate(['/learning/practice']);
  }

  onViewHistory(): void {
    void this.router.navigate(['/learning/history']);
  }

  onOpenParentTools(): void {
    void this.router.navigate(['/parent-tools']);
  }

  onOpenAssessment(): void {
    if (!this.activeChild()) {
      void this.router.navigate(['/parent-tools']);
      return;
    }

    void this.router.navigate(['/assessment']);
  }

  onOpenCreateLessonPlan(): void {
    void this.router.navigate(['/lesson-planning/create']);
  }

  onOpenUpcomingLessonPlans(): void {
    void this.router.navigate(['/lesson-planning/upcoming']);
  }

  onLogout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }

  onOpenRegistration(): void {
    void this.router.navigate(['/register']);
  }
}
