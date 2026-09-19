import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  PracticeAttempt,
  PresentedQuestionSnapshot,
} from '../../core/services/local-storage.service';
import { QuestionOption } from '../../core/models/question.model';
import { QuestionDisplayComponent } from '../../shared/components/question-display/question-display.component';

type AttemptQuestionStatus = 'CORRECT' | 'INCORRECT' | 'UNANSWERED';

@Component({
  selector: 'app-practice-attempt-detail',
  standalone: true,
  imports: [QuestionDisplayComponent],
  templateUrl: './practice-attempt-detail.component.html',
})
export class PracticeAttemptDetailComponent {
  @Input({ required: true }) attempt!: PracticeAttempt;

  @Output() backToHistory = new EventEmitter<void>();

  onBackToHistory(): void {
    this.backToHistory.emit();
  }

  formatCompletedDateTime(completedAtIso: string): string {
    const completedDate = new Date(completedAtIso);

    if (Number.isNaN(completedDate.getTime())) {
      return completedAtIso;
    }

    return completedDate.toLocaleString();
  }

  formatDuration(startedAtIso: string, completedAtIso: string): string {
    const startedAt = new Date(startedAtIso).getTime();
    const completedAt = new Date(completedAtIso).getTime();

    if (Number.isNaN(startedAt) || Number.isNaN(completedAt)) {
      return '0:00';
    }

    const totalSeconds = Math.max(0, Math.floor((completedAt - startedAt) / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }

  getSelectedOptionId(questionId: string): string | null {
    return this.attempt.selectedAnswers[questionId] ?? null;
  }

  isSelectedOption(questionId: string, optionId: string): boolean {
    return this.getSelectedOptionId(questionId) === optionId;
  }

  isCorrectOption(question: PresentedQuestionSnapshot, option: QuestionOption): boolean {
    return question.questionSnapshot.correctOptionId === option.id;
  }

  getQuestionStatus(question: PresentedQuestionSnapshot): AttemptQuestionStatus {
    const selectedOptionId = this.getSelectedOptionId(question.questionId);

    if (!selectedOptionId) {
      return 'UNANSWERED';
    }

    if (selectedOptionId === question.questionSnapshot.correctOptionId) {
      return 'CORRECT';
    }

    return 'INCORRECT';
  }

  getQuestionStatusLabel(question: PresentedQuestionSnapshot): string {
    const status = this.getQuestionStatus(question);

    if (status === 'CORRECT') {
      return 'Correct';
    }

    if (status === 'INCORRECT') {
      return 'Incorrect';
    }

    return 'Unanswered';
  }
}
