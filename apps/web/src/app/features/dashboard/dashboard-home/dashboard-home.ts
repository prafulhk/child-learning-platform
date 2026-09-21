import { Component, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-dashboard-home',
  styleUrl: './dashboard-home.scss',
  templateUrl: './dashboard-home.html',
})
export class DashboardHome {
  readonly startPractice = output<void>();
  readonly viewHistory = output<void>();
  readonly openParentTools = output<void>();
  readonly openAssessment = output<void>();
  readonly openRegistration = output<void>();
}
