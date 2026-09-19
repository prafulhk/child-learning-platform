import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  ActivePracticeSession,
  PracticeAttempt,
  PresentedQuestionSnapshot,
} from '../../core/services/local-storage.service';
import { PracticeService } from '../../core/services/practice.service';
import { AnswerOptionComponent } from '../../shared/components/answer-option/answer-option.component';
import { QuestionDisplayComponent } from '../../shared/components/question-display/question-display.component';

@Component({
  selector: 'app-practice-session',
  standalone: true,
  imports: [QuestionDisplayComponent, AnswerOptionComponent],
  templateUrl: './practice-session.component.html',
})
export class PracticeSessionComponent implements OnInit {
  readonly topicId = 'single-digit-addition';

  session: ActivePracticeSession | null = null;
  completed = false;
  completedAttempt: PracticeAttempt | null = null;

  constructor(
    private readonly practiceService: PracticeService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.session = this.practiceService.startPractice(this.topicId);
    this.changeDetectorRef.markForCheck();
  }

  get currentQuestionIndex(): number {
    return this.session?.currentQuestionIndex ?? 0;
  }

  get totalQuestions(): number {
    return this.session?.presentedQuestions.length ?? 0;
  }

  get currentPresentedQuestion(): PresentedQuestionSnapshot | null {
    if (!this.session) {
      return null;
    }

    return this.session.presentedQuestions[this.session.currentQuestionIndex] ?? null;
  }

  get selectedOptionIdForCurrentQuestion(): string | null {
    const current = this.currentPresentedQuestion;

    if (!current || !this.session) {
      return null;
    }

    return this.session.selectedAnswers[current.questionId] ?? null;
  }

  onSelectOption(selectedOptionId: string): void {
    if (this.completed || !this.session) {
      return;
    }

    const current = this.currentPresentedQuestion;

    if (!current) {
      return;
    }

    const isLastQuestion = this.currentQuestionIndex === this.totalQuestions - 1;

    this.practiceService.recordAnswer(current.questionId, selectedOptionId);

    this.session = this.practiceService.getSession();

    if (!this.session) {
      return;
    }

    if (isLastQuestion) {
      this.completedAttempt = this.practiceService.completePractice();

      this.completed = true;
      this.session = null;

      this.changeDetectorRef.markForCheck();
      return;
    }

    this.changeDetectorRef.markForCheck();
  }

  onPrevious(): void {
    if (this.completed || this.currentQuestionIndex === 0) {
      return;
    }

    this.practiceService.goToPrevious();

    this.session = this.practiceService.getSession() ?? this.session;

    this.changeDetectorRef.markForCheck();
  }
}
