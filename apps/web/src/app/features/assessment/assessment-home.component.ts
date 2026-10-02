import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import {
  OLYMPIAD_ASSESSMENT_CONFIG,
  type AssessmentConfig,
} from '../../core/models/assessment.model';

@Component({
  selector: 'app-assessment-home',
  standalone: true,
  templateUrl: './assessment-home.component.html',
})
export class AssessmentHomeComponent {
  readonly assessmentTitle = 'Abacus Olympiad Test';
  readonly config: AssessmentConfig = OLYMPIAD_ASSESSMENT_CONFIG;

  private readonly router = inject(Router);

  onStart(): void {
    void this.router.navigate(['/assessment/session']);
  }

  onBack(): void {
    void this.router.navigate(['/dashboard']);
  }

  onOpenHistory(): void {
    void this.router.navigate(['/assessment/history']);
  }
}
