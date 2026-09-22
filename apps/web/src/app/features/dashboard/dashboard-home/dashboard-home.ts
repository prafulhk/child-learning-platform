import { Component, inject, output } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  imports: [],
  selector: 'app-dashboard-home',
  styleUrl: './dashboard-home.scss',
  templateUrl: './dashboard-home.html',
})
export class DashboardHome {
  private readonly authService = inject(AuthService);

  readonly startPractice = output<void>();
  readonly viewHistory = output<void>();
  readonly openParentTools = output<void>();
  readonly openAssessment = output<void>();
  readonly openRegistration = output<void>();
  readonly openLogin = output<void>();
  readonly logout = output<void>();
  readonly currentUser = this.authService.currentUser;
}
