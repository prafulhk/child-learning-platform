import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  ActivePracticeSession,
  PracticeAttempt,
  PresentedQuestionSnapshot,
} from '../../core/services/local-storage.service';
import { PracticeService } from '../../core/services/practice.service';
import { AnswerOptionComponent } from '../../shared/components/answer-option/answer-option.component';
import { QuestionDisplayComponent } from '../../shared/components/question-display/question-display.component';
import { PracticeResultComponent } from './practice-result.component';
import { AttemptsApiService } from '../../core/services/attempts-api.service.ts';

@Component({
  selector: 'app-practice-session',
  standalone: true,
  imports: [QuestionDisplayComponent, AnswerOptionComponent, PracticeResultComponent],
  templateUrl: './practice-session.component.html',
})
export class PracticeSessionComponent implements OnInit, OnDestroy {
  @Output() backToHome = new EventEmitter<void>();
  readonly topicId = 'single-digit-addition';
  private readonly countdownTickMs = 1000;
  session: ActivePracticeSession | null = null;
  completed = false;
  completedAttempt: PracticeAttempt | null = null;
  remainingSeconds = 0;

  private countdownTimerId: ReturnType<typeof window.setInterval> | null = null;

  constructor(
    private readonly practiceService: PracticeService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly attemptsApiService: AttemptsApiService,
  ) {}

  ngOnInit(): void {
    const existingSession = this.practiceService.getSession();

    if (existingSession) {
      if (this.practiceService.isSessionExpired(existingSession)) {
        this.completePractice();
        return;
      }

      this.session = existingSession;
      this.remainingSeconds = this.practiceService.getRemainingSeconds(existingSession);
      this.startCountdown();
      this.changeDetectorRef.markForCheck();
      return;
    }

    this.session = this.practiceService.startPractice(this.topicId);
    this.remainingSeconds = this.practiceService.getRemainingSeconds(this.session);
    this.startCountdown();
    this.changeDetectorRef.markForCheck();
  }

  ngOnDestroy(): void {
    this.stopCountdown();
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

  get remainingTimeLabel(): string {
    return this.formatRemainingTime(this.remainingSeconds);
  }

  onSelectOption(selectedOptionId: string): void {
    if (this.completed || !this.session) {
      return;
    }

    this.syncTimerState();

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

    this.remainingSeconds = this.practiceService.getRemainingSeconds(this.session);

    if (this.practiceService.isSessionExpired(this.session)) {
      this.completePractice();
      return;
    }

    if (isLastQuestion) {
      this.completePractice();
      return;
    }

    this.changeDetectorRef.markForCheck();
  }

  onPrevious(): void {
    if (this.completed || this.currentQuestionIndex === 0) {
      return;
    }

    this.syncTimerState();

    if (this.completed || !this.session) {
      return;
    }

    this.practiceService.goToPrevious();

    this.session = this.practiceService.getSession() ?? this.session;
    this.remainingSeconds = this.practiceService.getRemainingSeconds(this.session);

    this.changeDetectorRef.markForCheck();
  }

  private startCountdown(): void {
    this.stopCountdown();

    this.countdownTimerId = window.setInterval(() => {
      this.syncTimerState();
    }, this.countdownTickMs);
  }

  private stopCountdown(): void {
    if (this.countdownTimerId === null) {
      return;
    }

    window.clearInterval(this.countdownTimerId);
    this.countdownTimerId = null;
  }

  private syncTimerState(): void {
    if (!this.session || this.completed) {
      this.remainingSeconds = 0;
      return;
    }

    this.remainingSeconds = this.practiceService.getRemainingSeconds(this.session);

    if (this.remainingSeconds > 0) {
      this.changeDetectorRef.markForCheck();
      return;
    }

    this.completePractice();
  }

  private completePractice(): void {
    if (this.completed) {
      return;
    }

    this.stopCountdown();

    const attempt = this.practiceService.completePractice();

    // Keep the completed attempt available for the result screen.
    this.completedAttempt = attempt;
    this.completed = true;
    this.session = null;
    this.remainingSeconds = 0;

    // Save the completed attempt to MongoDB.
    this.saveAttemptToBackend(attempt);

    this.changeDetectorRef.markForCheck();
  }

  private saveAttemptToBackend(attempt: PracticeAttempt): void {
    this.attemptsApiService
      .saveAttempt({
        clientAttemptId: attempt.id,
        attemptType: 'PRACTICE',
        topicId: attempt.topicId,
        startedAt: attempt.startedAt,
        completedAt: attempt.completedAt,
        presentedQuestions: attempt.presentedQuestions,
        selectedAnswers: attempt.selectedAnswers,
        flaggedQuestionIds: [],
        result: attempt.result,
      })
      .subscribe({
        next: () => {
          console.log('Practice attempt saved successfully.');
        },
        error: (error) => {
          // The result screen still works if the API is unavailable.
          console.error('Unable to save practice attempt:', error);
        },
      });
  }

  restartPractice(): void {
    this.stopCountdown();
    this.completed = false;
    this.completedAttempt = null;
    this.session = this.practiceService.startPractice(this.topicId);
    this.remainingSeconds = this.practiceService.getRemainingSeconds(this.session);
    this.startCountdown();
    this.changeDetectorRef.markForCheck();
  }

  private formatRemainingTime(totalSeconds: number): string {
    const safeSeconds = Math.max(0, totalSeconds);
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  onBackToHome(): void {
    this.backToHome.emit();
  }
}
