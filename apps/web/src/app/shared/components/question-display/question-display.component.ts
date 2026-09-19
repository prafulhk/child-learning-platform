import { Component, Input } from '@angular/core';
import { SimpleArithmeticQuestion } from '../../../core/models/question.model';

@Component({
  selector: 'app-question-display',
  standalone: true,
  templateUrl: './question-display.component.html',
})
export class QuestionDisplayComponent {
  @Input({ required: true }) question!: SimpleArithmeticQuestion;

  showMinus(index: number, operator?: '-'): boolean {
    return index > 0 && operator === '-';
  }
}
