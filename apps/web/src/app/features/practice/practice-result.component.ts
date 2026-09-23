import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PracticeAttempt } from '../../core/services/local-storage.service';
import type { AssessmentAttempt } from '../../core/models/assessment.model';

@Component({
  selector: 'app-practice-result',
  standalone: true,
  templateUrl: './practice-result.component.html',
})
export class PracticeResultComponent {
  @Input({ required: true }) attempt!: PracticeAttempt | AssessmentAttempt;

  @Input() title = 'Practice Completed';

  @Input() actionLabel = 'Practice Again';

  @Input() actionType: 'restart' | 'backToHome' = 'restart';

  @Output() restart = new EventEmitter<void>();

  @Output() backToHome = new EventEmitter<void>();

  onRestart(): void {
    this.restart.emit();
  }

  onBackToHome(): void {
    this.backToHome.emit();
  }
}
