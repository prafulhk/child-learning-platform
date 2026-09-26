import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import type { QuestionOption } from '../../../core/models/question.model';

@Component({
  selector: 'app-answer-option',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './answer-option.component.html',
})
export class AnswerOptionComponent {
  @Input({ required: true })
  option!: QuestionOption;

  @Input()
  selected = false;

  @Input()
  optionNumber = 0;

  @Output()
  optionSelected = new EventEmitter<string>();

  get optionLetter(): string {
    return String.fromCharCode('A'.charCodeAt(0) + this.optionNumber);
  }

  onSelect(): void {
    this.optionSelected.emit(this.option.id);
  }
}
