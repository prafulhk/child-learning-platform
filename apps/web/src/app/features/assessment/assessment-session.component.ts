import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import type { AssessmentQuestionSnapshot } from '../../core/models/assessment.model';
import type { QuestionOption } from '../../core/models/question.model';

import { AnswerOptionComponent } from '../../shared/components/answer-option/answer-option.component';
import { QuestionDisplayComponent } from '../../shared/components/question-display/question-display.component';

@Component({
  selector: 'app-assessment-session',
  standalone: true,
  imports: [QuestionDisplayComponent, AnswerOptionComponent],
  templateUrl: './assessment-session.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssessmentSessionComponent {
  @Input({ required: true })
  question!: AssessmentQuestionSnapshot;

  @Input()
  currentQuestionIndex = 0;

  @Input()
  totalQuestions = 100;

  @Input()
  selectedOptionId: string | null = null;

  @Input()
  flagged = false;

  @Input()
  timeRemainingLabel = '15:00';

  @Output()
  readonly optionSelected = new EventEmitter<string>();

  @Output()
  readonly previous = new EventEmitter<void>();

  @Output()
  readonly flag = new EventEmitter<void>();

  get questionNumber(): number {
    return this.currentQuestionIndex + 1;
  }

  get options(): QuestionOption[] {
    return this.question.questionSnapshot.options;
  }

  onOptionSelected(optionId: string): void {
    this.optionSelected.emit(optionId);
  }

  onPrevious(): void {
    this.previous.emit();
  }

  onFlag(): void {
    this.flag.emit();
  }
}
