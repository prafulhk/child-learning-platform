import { Component, EventEmitter, Output } from '@angular/core';

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

  @Output() readonly startAssessment = new EventEmitter<void>();
  @Output() readonly back = new EventEmitter<void>();

  onStart(): void {
    this.startAssessment.emit();
  }

  onBack(): void {
    this.back.emit();
  }
}
