import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { NgClass } from '@angular/common';

import type { AssessmentQuestionSnapshot } from '../../core/models/assessment.model';
import type { QuestionOption } from '../../core/models/question.model';

import { AnswerOptionComponent } from '../../shared/components/answer-option/answer-option.component';
import { QuestionDisplayComponent } from '../../shared/components/question-display/question-display.component';

export interface QuestionPaletteItem {
  number: number;
  answered: boolean;
  flagged: boolean;
}

@Component({
  selector: 'app-assessment-session',

  standalone: true,

  imports: [QuestionDisplayComponent, AnswerOptionComponent, NgClass],

  templateUrl: './assessment-session.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssessmentSessionComponent {
  // ============================================================
  // INPUTS
  // ============================================================

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

  @Input()
  questionPalette: QuestionPaletteItem[] = [];

  // ============================================================
  // OUTPUTS
  // ============================================================

  @Output()
  readonly optionSelected = new EventEmitter<string>();

  @Output()
  readonly previous = new EventEmitter<void>();

  @Output()
  readonly flag = new EventEmitter<void>();

  @Output()
  readonly submitAssessment = new EventEmitter<void>();

  @Output()
  readonly next = new EventEmitter<void>();

  @Output()
  readonly questionNavigate = new EventEmitter<number>();

  @Output()
  readonly clearAnswer = new EventEmitter<void>();

  // ============================================================
  // GETTERS
  // ============================================================

  get questionNumber(): number {
    return this.currentQuestionIndex + 1;
  }

  get options(): QuestionOption[] {
    return this.question.questionSnapshot.options;
  }

  // ============================================================
  // EVENT HANDLERS
  // ============================================================

  onOptionSelected(optionId: string): void {
    this.optionSelected.emit(optionId);
  }

  onPrevious(): void {
    this.previous.emit();
  }

  onFlag(): void {
    this.flag.emit();
  }

  onSubmitAssessment(): void {
    this.submitAssessment.emit();
  }

  onNext(): void {
    this.next.emit();
  }

  onQuestionNavigate(index: number): void {
    this.questionNavigate.emit(index);
  }

  onClear(): void {
    this.clearAnswer.emit();
  }
}
