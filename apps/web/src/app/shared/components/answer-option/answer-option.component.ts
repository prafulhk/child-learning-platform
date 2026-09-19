import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QuestionOption } from '../../../core/models/question.model';

@Component({
  selector: 'app-answer-option',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './answer-option.component.html',
})
export class AnswerOptionComponent {
  @Input({ required: true }) option!: QuestionOption;
  @Input() selected = false;

  @Output() optionSelected = new EventEmitter<string>();

  onSelect(): void {
    this.optionSelected.emit(this.option.id);
  }
}
