import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  inject,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';

import {
  OLYMPIAD_ASSESSMENT_CONFIG,
  type ActiveAssessmentSession,
  type AssessmentAttempt,
  type AssessmentDefinition,
  type AssessmentQuestionSnapshot,
} from '../../core/models/assessment.model';
import type { QuestionOption } from '../../core/models/question.model';

import { AssessmentService } from '../../core/services/assessment.service';
import { AttemptsApiService } from '../../core/services/attempts-api.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { QuestionService } from '../../core/services/question.service';

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
export class AssessmentSessionComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly assessmentService = inject(AssessmentService);
  private readonly attemptsApiService = inject(AttemptsApiService);
  private readonly questionService = inject(QuestionService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  readonly olympiadDefinition: AssessmentDefinition = {
    id: 'olympiad-test',
    title: 'Abacus Olympiad Test',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    config: OLYMPIAD_ASSESSMENT_CONFIG,
  };

  @Output() optionSelected = new EventEmitter<string>();
  @Output() next = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
  @Output() flag = new EventEmitter<void>();
  @Output() clearAnswer = new EventEmitter<void>();
  @Output() questionNavigate = new EventEmitter<number>();
  @Output() submitAssessment = new EventEmitter<void>();

  @Input('question') inputQuestion: AssessmentQuestionSnapshot | null = null;
  @Input('currentQuestionIndex') inputCurrentQuestionIndex: number | null = null;
  @Input('totalQuestions') inputTotalQuestions: number | null = null;
  @Input('selectedOptionId') inputSelectedOptionId: string | null = null;
  @Input('flagged') inputFlagged: boolean | null = null;
  @Input('timeRemainingLabel') inputTimeRemainingLabel: string | null = null;
  @Input('questionPalette') inputQuestionPalette: QuestionPaletteItem[] | null = null;

  activeAssessmentSession: ActiveAssessmentSession | null = null;
  assessmentRemainingSeconds = 0;

  private assessmentCountdownTimerId: ReturnType<typeof window.setInterval> | null = null;
  private readonly assessmentCountdownTickMs = 250;
  private assessmentCompletionLocked = false;
  private assessmentAnswerTransitioning = false;

  constructor() {
    this.startAssessment();
  }

  ngOnDestroy(): void {
    this.stopAssessmentCountdown();
  }

  get currentQuestion(): AssessmentQuestionSnapshot | null {
    const session = this.activeAssessmentSession;

    if (!session) {
      return null;
    }

    return session.questions[session.currentQuestionIndex] ?? null;
  }

  get question(): AssessmentQuestionSnapshot {
    const question = this.inputQuestion ?? this.currentQuestion;

    if (!question) {
      throw new Error('Assessment question is unavailable.');
    }

    return question;
  }

  get currentQuestionIndex(): number {
    if (this.inputCurrentQuestionIndex !== null) {
      return this.inputCurrentQuestionIndex;
    }

    return this.activeAssessmentSession?.currentQuestionIndex ?? 0;
  }

  get questionNumber(): number {
    return this.currentQuestionIndex + 1;
  }

  get totalQuestions(): number {
    if (this.inputTotalQuestions !== null) {
      return this.inputTotalQuestions;
    }

    return this.activeAssessmentSession?.questions.length ?? 0;
  }

  get options(): QuestionOption[] {
    return this.currentQuestion?.questionSnapshot.options ?? [];
  }

  get selectedOptionId(): string | null {
    if (this.inputSelectedOptionId !== null) {
      return this.inputSelectedOptionId;
    }

    const session = this.activeAssessmentSession;
    const question = this.currentQuestion;

    if (!session || !question) {
      return null;
    }

    return session.selectedAnswers[question.questionId] ?? null;
  }

  get flagged(): boolean {
    if (this.inputFlagged !== null) {
      return this.inputFlagged;
    }

    const session = this.activeAssessmentSession;
    const question = this.currentQuestion;

    if (!session || !question) {
      return false;
    }

    return session.flaggedQuestionIds.includes(question.questionId);
  }

  get timeRemainingLabel(): string {
    if (this.inputTimeRemainingLabel !== null) {
      return this.inputTimeRemainingLabel;
    }

    return this.formatRemainingTime(this.assessmentRemainingSeconds);
  }

  get questionPalette(): QuestionPaletteItem[] {
    if (this.inputQuestionPalette) {
      return this.inputQuestionPalette;
    }

    const session = this.activeAssessmentSession;

    if (!session) {
      return [];
    }

    return session.questions.map((question, index) => ({
      number: index + 1,
      answered: Boolean(session.selectedAnswers[question.questionId]),
      flagged: session.flaggedQuestionIds.includes(question.questionId),
    }));
  }

  onOptionSelected(optionId: string): void {
    this.syncAssessmentTimer();

    const session = this.activeAssessmentSession;
    const question = this.currentQuestion;

    if (
      !session ||
      !question ||
      this.assessmentRemainingSeconds === 0 ||
      this.assessmentAnswerTransitioning
    ) {
      return;
    }

    session.selectedAnswers = {
      ...session.selectedAnswers,
      [question.questionId]: optionId,
    };

    this.optionSelected.emit(optionId);

    this.assessmentAnswerTransitioning = true;

    setTimeout(() => {
      this.assessmentAnswerTransitioning = false;

      if (!this.activeAssessmentSession || this.assessmentRemainingSeconds === 0) {
        return;
      }

      if (session.currentQuestionIndex < session.questions.length - 1) {
        session.currentQuestionIndex += 1;
      }

      this.changeDetectorRef.markForCheck();
    }, 0);
  }

  onPrevious(): void {
    this.syncAssessmentTimer();

    const session = this.activeAssessmentSession;

    if (!session || this.assessmentRemainingSeconds === 0) {
      return;
    }

    if (session.currentQuestionIndex > 0) {
      session.currentQuestionIndex -= 1;
      this.previous.emit();
      this.changeDetectorRef.markForCheck();
    }
  }

  onNext(): void {
    this.syncAssessmentTimer();

    const session = this.activeAssessmentSession;

    if (!session || this.assessmentRemainingSeconds === 0) {
      return;
    }

    if (session.currentQuestionIndex < session.questions.length - 1) {
      session.currentQuestionIndex += 1;
      this.next.emit();
      this.changeDetectorRef.markForCheck();
    }
  }

  onQuestionNavigate(index: number): void {
    this.syncAssessmentTimer();

    const session = this.activeAssessmentSession;

    if (
      !session ||
      this.assessmentRemainingSeconds === 0 ||
      index < 0 ||
      index >= session.questions.length
    ) {
      return;
    }

    session.currentQuestionIndex = index;
    this.questionNavigate.emit(index);
    this.changeDetectorRef.markForCheck();
  }

  onClear(): void {
    this.syncAssessmentTimer();

    const session = this.activeAssessmentSession;
    const question = this.currentQuestion;

    if (!session || !question || this.assessmentRemainingSeconds === 0) {
      return;
    }

    const selectedAnswers = { ...session.selectedAnswers };
    delete selectedAnswers[question.questionId];
    session.selectedAnswers = selectedAnswers;
    this.clearAnswer.emit();
    this.changeDetectorRef.markForCheck();
  }

  onFlag(): void {
    this.syncAssessmentTimer();

    const session = this.activeAssessmentSession;
    const question = this.currentQuestion;

    if (!session || !question || this.assessmentRemainingSeconds === 0) {
      return;
    }

    const flaggedIds = new Set(session.flaggedQuestionIds);

    if (flaggedIds.has(question.questionId)) {
      flaggedIds.delete(question.questionId);
    } else {
      flaggedIds.add(question.questionId);
    }

    session.flaggedQuestionIds = [...flaggedIds];
    this.flag.emit();
    this.changeDetectorRef.markForCheck();
  }

  onSubmitAssessment(): void {
    this.syncAssessmentTimer();

    if (this.assessmentCompletionLocked || !this.activeAssessmentSession) {
      return;
    }

    this.submitAssessment.emit();
    this.completeAssessment();
  }

  @HostListener('document:visibilitychange')
  onVisibilityChange(): void {
    if (document.visibilityState === 'hidden') {
      this.stopAssessmentCountdown();
      return;
    }

    this.resumeAssessmentCountdown();
  }

  @HostListener('window:focus')
  onWindowFocus(): void {
    this.resumeAssessmentCountdown();
  }

  @HostListener('window:pageshow')
  onPageShow(): void {
    this.resumeAssessmentCountdown();
  }

  private startAssessment(): void {
    this.stopAssessmentCountdown();
    this.activeAssessmentSession = null;
    this.assessmentCompletionLocked = false;
    this.assessmentRemainingSeconds = 0;

    try {
      const questionPool = this.questionService.getQuestionsByTopic(
        this.olympiadDefinition.topicId,
      );

      this.activeAssessmentSession = this.assessmentService.createSession(
        this.olympiadDefinition,
        questionPool,
      );

      this.startAssessmentCountdown();
    } catch {
      void this.router.navigate(['/assessment']);
    }
  }

  private startAssessmentCountdown(): void {
    this.stopAssessmentCountdown();
    this.syncAssessmentTimer();

    if (!this.activeAssessmentSession) {
      return;
    }

    this.assessmentCountdownTimerId = window.setInterval(() => {
      this.syncAssessmentTimer();
    }, this.assessmentCountdownTickMs);
  }

  private stopAssessmentCountdown(): void {
    if (this.assessmentCountdownTimerId !== null) {
      window.clearInterval(this.assessmentCountdownTimerId);
      this.assessmentCountdownTimerId = null;
    }
  }

  private resumeAssessmentCountdown(): void {
    if (!this.activeAssessmentSession) {
      return;
    }

    this.syncAssessmentTimer();

    if (this.activeAssessmentSession) {
      this.startAssessmentCountdown();
    }
  }

  private syncAssessmentTimer(): void {
    const session = this.activeAssessmentSession;

    if (!session) {
      this.assessmentRemainingSeconds = 0;
      this.stopAssessmentCountdown();
      return;
    }

    const remainingMilliseconds = this.getAssessmentRemainingMilliseconds(session);
    const nextRemainingSeconds =
      remainingMilliseconds > 0 ? Math.ceil(remainingMilliseconds / 1000) : 0;

    this.assessmentRemainingSeconds = nextRemainingSeconds;

    if (remainingMilliseconds <= 0) {
      this.completeAssessment();
      return;
    }

    this.changeDetectorRef.markForCheck();
  }

  private getAssessmentRemainingMilliseconds(session: ActiveAssessmentSession): number {
    const endsAtMilliseconds = new Date(session.endsAt).getTime();

    if (Number.isNaN(endsAtMilliseconds)) {
      return 0;
    }

    return Math.max(0, endsAtMilliseconds - Date.now());
  }

  private formatRemainingTime(totalSeconds: number): string {
    const safeSeconds = Math.max(0, totalSeconds);
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  private completeAssessment(): void {
    if (this.assessmentCompletionLocked) {
      return;
    }

    const session = this.activeAssessmentSession;

    if (!session) {
      return;
    }

    this.assessmentCompletionLocked = true;

    try {
      const attempt = this.buildAssessmentAttempt(session);

      this.localStorageService.saveCompletedAssessmentAttempt(attempt);
      this.saveAssessmentAttemptToBackend(attempt);

      this.activeAssessmentSession = null;
      this.assessmentRemainingSeconds = 0;
      this.stopAssessmentCountdown();

      void this.router.navigate(['/assessment/result', attempt.id]);
    } catch {
      this.assessmentCompletionLocked = false;
      this.changeDetectorRef.markForCheck();
    }
  }

  private buildAssessmentAttempt(session: ActiveAssessmentSession): AssessmentAttempt {
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    for (const question of session.questions) {
      const selectedOptionId = session.selectedAnswers[question.questionId];

      if (!selectedOptionId) {
        unansweredCount += 1;
      } else if (selectedOptionId === question.questionSnapshot.correctOptionId) {
        correctCount += 1;
      } else {
        incorrectCount += 1;
      }
    }

    const totalQuestions = session.questions.length;
    const accuracyPercentage =
      totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    return {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      assessmentId: session.assessmentId,
      startedAt: session.startedAt,
      completedAt: new Date().toISOString(),
      questions: this.cloneAssessmentQuestions(session.questions),
      selectedAnswers: { ...session.selectedAnswers },
      flaggedQuestionIds: [...session.flaggedQuestionIds],
      result: {
        totalQuestions,
        correctCount,
        incorrectCount,
        unansweredCount,
        accuracyPercentage,
      },
    };
  }

  private cloneAssessmentQuestions(
    questions: AssessmentQuestionSnapshot[],
  ): AssessmentQuestionSnapshot[] {
    return questions.map((question) => ({
      ...question,
      questionSnapshot: {
        ...question.questionSnapshot,
        rows: question.questionSnapshot.rows.map((row) => ({
          ...row,
        })),
        options: question.questionSnapshot.options.map((option) => ({
          ...option,
        })),
      },
    }));
  }

  private saveAssessmentAttemptToBackend(attempt: AssessmentAttempt): void {
    this.attemptsApiService
      .saveAttempt({
        clientAttemptId: attempt.id,
        attemptType: 'ASSESSMENT',
        assessmentId: attempt.assessmentId,
        title: this.olympiadDefinition.title,
        startedAt: attempt.startedAt,
        completedAt: attempt.completedAt,
        presentedQuestions: attempt.questions,
        selectedAnswers: attempt.selectedAnswers,
        flaggedQuestionIds: attempt.flaggedQuestionIds,
        result: attempt.result,
      })
      .subscribe({
        error: () => {
          // Local persistence is the source used by the result route.
        },
      });
  }
}
