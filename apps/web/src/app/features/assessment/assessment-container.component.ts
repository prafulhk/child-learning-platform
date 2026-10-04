import { ChangeDetectorRef, Component, OnDestroy, HostListener, inject } from '@angular/core';
import {
  OLYMPIAD_ASSESSMENT_CONFIG,
  type ActiveAssessmentSession,
  type AssessmentAttempt,
  type AssessmentDefinition,
  type AssessmentQuestionSnapshot,
} from '../../core/models/assessment.model';
import { AssessmentService } from '../../core/services/assessment.service';
import { QuestionService } from '../../core/services/question.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { AttemptsApiService } from '../../core/services/attempts-api.service';
import { ActiveChildService } from '../../core/services/active-child.service';
import { Router } from '@angular/router';

import { AssessmentHomeComponent } from './assessment-home.component';
import { AssessmentSessionComponent, QuestionPaletteItem } from './assessment-session.component';
import { AssessmentHistoryComponent } from './assessment-history.component';

type AssessmentView = 'HOME' | 'SESSION' | 'RESULT' | 'HISTORY';

@Component({
  selector: 'app-assessment-container',
  standalone: true,
  imports: [AssessmentHomeComponent, AssessmentSessionComponent, AssessmentHistoryComponent],
  template: `
    @switch (view) {
      @case ('HOME') {
        <app-assessment-home
          (startAssessment)="onStartAssessment()"
          (openHistory)="onViewHistory()"
          (back)="onBackToHome()"
        >
        </app-assessment-home>
      }
      @case ('SESSION') {
        @if (currentAssessmentQuestion) {
          <app-assessment-session
            [question]="currentAssessmentQuestion"
            [currentQuestionIndex]="activeAssessmentSession?.currentQuestionIndex ?? 0"
            [totalQuestions]="activeAssessmentSession?.questions.length ?? 0"
            [selectedOptionId]="currentAssessmentSelectedOptionId"
            [flagged]="currentAssessmentFlagged"
            [timeRemainingLabel]="assessmentRemainingTimeLabel"
            [questionPalette]="assessmentQuestionPalette"
            (optionSelected)="onAssessmentOptionSelected($event)"
            (next)="onAssessmentNext()"
            (previous)="onAssessmentPrevious()"
            (flag)="onAssessmentFlag()"
            (submitAssessment)="onSubmitAssessment()"
            (questionNavigate)="onAssessmentQuestionNavigate($event)"
            (clearAnswer)="onAssessmentClear()"
          >
          </app-assessment-session>
        }
      }
      @case ('RESULT') {
        @if (completedAssessmentAttempt) {
          <app-assessment-home (back)="onBackToHome()"> </app-assessment-home>
        }
      }
      @case ('HISTORY') {
        <app-assessment-history (backToHome)="onBackToHome()"></app-assessment-history>
      }
    }
  `,
})
export class AssessmentContainerComponent implements OnDestroy {
  private readonly assessmentService = inject(AssessmentService);
  private readonly questionService = inject(QuestionService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly attemptsApiService = inject(AttemptsApiService);
  private readonly activeChildService = inject(ActiveChildService);
  private readonly router = inject(Router);

  view: AssessmentView = 'HOME';
  activeAssessmentSession: ActiveAssessmentSession | null = null;
  assessmentError = '';
  assessmentRemainingSeconds = 0;
  completedAssessmentAttempt: AssessmentAttempt | null = null;

  private assessmentCountdownTimerId: ReturnType<typeof window.setInterval> | null = null;
  private readonly assessmentCountdownTickMs = 250;
  private assessmentCompletionLocked = false;
  private assessmentAnswerTransitioning = false;

  readonly olympiadDefinition: AssessmentDefinition = {
    id: 'olympiad-test',
    title: 'Abacus Olympiad Test',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    config: OLYMPIAD_ASSESSMENT_CONFIG,
  };

  ngOnDestroy(): void {
    this.stopAssessmentCountdown();
  }

  onStartAssessment(): void {
    const activeChild = this.activeChildService.activeChild();

    if (!activeChild) {
      void this.router.navigate(['/parent-tools']);
      return;
    }

    this.stopAssessmentCountdown();
    this.activeAssessmentSession = null;
    this.completedAssessmentAttempt = null;
    this.assessmentCompletionLocked = false;
    this.assessmentRemainingSeconds = 0;
    this.assessmentError = '';

    try {
      const questionPool = this.questionService.getQuestionsByTopic(
        this.olympiadDefinition.topicId,
      );

      this.activeAssessmentSession = this.assessmentService.createSession(
        this.olympiadDefinition,
        questionPool,
      );

      this.view = 'SESSION';
      this.startAssessmentCountdown();
    } catch (error) {
      this.assessmentError =
        error instanceof Error
          ? error.message
          : 'Unable to start the assessment. Please try again.';

      this.view = 'HOME';
    }
  }

  onViewHistory(): void {
    this.stopAssessmentCountdown();
    this.view = 'HISTORY';
  }

  onBackToHome(): void {
    this.stopAssessmentCountdown();
    this.activeAssessmentSession = null;
    this.completedAssessmentAttempt = null;
    this.assessmentCompletionLocked = false;
    this.assessmentRemainingSeconds = 0;
    this.assessmentError = '';
    this.view = 'HOME';
  }

  onAssessmentOptionSelected(optionId: string): void {
    this.syncAssessmentTimer();

    const session = this.activeAssessmentSession;

    if (
      !session ||
      this.view !== 'SESSION' ||
      this.assessmentRemainingSeconds === 0 ||
      this.assessmentAnswerTransitioning
    ) {
      return;
    }

    const currentQuestion = session.questions[session.currentQuestionIndex];

    if (!currentQuestion) {
      return;
    }

    session.selectedAnswers = {
      ...session.selectedAnswers,
      [currentQuestion.questionId]: optionId,
    };

    this.assessmentAnswerTransitioning = true;

    setTimeout(() => {
      this.assessmentAnswerTransitioning = false;

      if (
        !this.activeAssessmentSession ||
        this.view !== 'SESSION' ||
        this.assessmentRemainingSeconds === 0
      ) {
        return;
      }

      if (session.currentQuestionIndex < session.questions.length - 1) {
        session.currentQuestionIndex += 1;
      }
    }, 0);
  }

  onAssessmentPrevious(): void {
    this.syncAssessmentTimer();

    const session = this.activeAssessmentSession;

    if (!session || this.view !== 'SESSION' || this.assessmentRemainingSeconds === 0) {
      return;
    }

    if (session.currentQuestionIndex > 0) {
      session.currentQuestionIndex -= 1;
    }
  }

  onAssessmentFlag(): void {
    this.syncAssessmentTimer();

    const session = this.activeAssessmentSession;

    if (!session || this.view !== 'SESSION' || this.assessmentRemainingSeconds === 0) {
      return;
    }

    const currentQuestion = session.questions[session.currentQuestionIndex];

    if (!currentQuestion) {
      return;
    }

    const flaggedIds = new Set(session.flaggedQuestionIds);

    if (flaggedIds.has(currentQuestion.questionId)) {
      flaggedIds.delete(currentQuestion.questionId);
    } else {
      flaggedIds.add(currentQuestion.questionId);
    }

    session.flaggedQuestionIds = [...flaggedIds];
  }

  get currentAssessmentQuestion(): AssessmentQuestionSnapshot | null {
    const session = this.activeAssessmentSession;

    if (!session) {
      return null;
    }

    return session.questions[session.currentQuestionIndex] ?? null;
  }

  get currentAssessmentSelectedOptionId(): string | null {
    const session = this.activeAssessmentSession;
    const question = this.currentAssessmentQuestion;

    if (!session || !question) {
      return null;
    }

    return session.selectedAnswers[question.questionId] ?? null;
  }

  get currentAssessmentFlagged(): boolean {
    const session = this.activeAssessmentSession;
    const question = this.currentAssessmentQuestion;

    if (!session || !question) {
      return false;
    }

    return session.flaggedQuestionIds.includes(question.questionId);
  }

  get assessmentRemainingTimeLabel(): string {
    return this.formatRemainingTime(this.assessmentRemainingSeconds);
  }

  onSubmitAssessment(): void {
    this.syncAssessmentTimer();

    if (this.view === 'RESULT') {
      return;
    }

    if (this.completeAssessment()) {
      this.view = 'RESULT';
    }
  }

  onAssessmentNext(): void {
    this.syncAssessmentTimer();

    const session = this.activeAssessmentSession;

    if (!session || this.view !== 'SESSION' || this.assessmentRemainingSeconds === 0) {
      return;
    }

    if (session.currentQuestionIndex < session.questions.length - 1) {
      session.currentQuestionIndex += 1;
    }
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

  get assessmentQuestionPalette(): QuestionPaletteItem[] {
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

  onAssessmentQuestionNavigate(index: number): void {
    this.syncAssessmentTimer();

    const session = this.activeAssessmentSession;

    if (!session || this.view !== 'SESSION' || this.assessmentRemainingSeconds === 0) {
      return;
    }

    if (index < 0 || index >= session.questions.length) {
      return;
    }

    session.currentQuestionIndex = index;

    this.changeDetectorRef.markForCheck();
  }

  onAssessmentClear(): void {
    this.syncAssessmentTimer();

    const session = this.activeAssessmentSession;

    if (!session || this.view !== 'SESSION' || this.assessmentRemainingSeconds === 0) {
      return;
    }

    const currentQuestion = session.questions[session.currentQuestionIndex];

    if (!currentQuestion) {
      return;
    }

    const selectedAnswers = {
      ...session.selectedAnswers,
    };

    delete selectedAnswers[currentQuestion.questionId];

    session.selectedAnswers = selectedAnswers;

    this.changeDetectorRef.markForCheck();
  }

  private startAssessmentCountdown(): void {
    this.stopAssessmentCountdown();

    this.syncAssessmentTimer();

    if (!this.activeAssessmentSession || this.view !== 'SESSION') {
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
    if (!this.activeAssessmentSession || this.view !== 'SESSION') {
      return;
    }

    this.syncAssessmentTimer();

    if (!this.activeAssessmentSession || this.view !== 'SESSION') {
      return;
    }

    this.startAssessmentCountdown();
  }

  private syncAssessmentTimer(): void {
    const session = this.activeAssessmentSession;

    if (!session || this.view !== 'SESSION') {
      this.assessmentRemainingSeconds = 0;
      this.stopAssessmentCountdown();
      return;
    }

    const remainingMilliseconds = this.getAssessmentRemainingMilliseconds(session);
    const nextRemainingSeconds =
      remainingMilliseconds > 0 ? Math.ceil(remainingMilliseconds / 1000) : 0;
    const remainingSecondsChanged = nextRemainingSeconds !== this.assessmentRemainingSeconds;

    this.assessmentRemainingSeconds = nextRemainingSeconds;

    if (remainingMilliseconds <= 0) {
      this.finishAssessmentSession();
      return;
    }

    if (remainingSecondsChanged) {
      this.changeDetectorRef.markForCheck();
    }
  }

  private getAssessmentRemainingMilliseconds(
    session: ActiveAssessmentSession | null = this.activeAssessmentSession,
  ): number {
    if (!session) {
      return 0;
    }

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

  private finishAssessmentSession(): void {
    if (!this.completeAssessment()) {
      return;
    }

    this.view = 'RESULT';
    this.changeDetectorRef.detectChanges();
  }

  private completeAssessment(): boolean {
    if (this.assessmentCompletionLocked) {
      return false;
    }

    const session = this.activeAssessmentSession;

    if (!session) {
      return false;
    }

    this.assessmentCompletionLocked = true;

    try {
      const attempt = this.buildAssessmentAttempt(session);

      this.completedAssessmentAttempt = attempt;
      this.localStorageService.saveCompletedAssessmentAttempt(attempt);
      this.saveAssessmentAttemptToBackend(attempt);

      this.activeAssessmentSession = null;
      this.assessmentRemainingSeconds = 0;
      this.stopAssessmentCountdown();

      return true;
    } catch (error) {
      this.assessmentCompletionLocked = false;
      throw error;
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
    const activeChild = this.activeChildService.activeChild();

    if (!activeChild) {
      return;
    }

    this.attemptsApiService
      .saveAttempt({
        clientAttemptId: attempt.id,
        attemptType: 'ASSESSMENT',
        childId: activeChild._id,
        assessmentId: attempt.assessmentId,
        title: 'Abacus Olympiad Test',
        startedAt: attempt.startedAt,
        completedAt: attempt.completedAt,
        presentedQuestions: attempt.questions,
        selectedAnswers: attempt.selectedAnswers,
        flaggedQuestionIds: attempt.flaggedQuestionIds,
        result: attempt.result,
      })
      .subscribe({
        next: () => {
          console.log('Assessment attempt saved successfully.');
        },

        error: (error) => {
          console.error('Unable to save assessment attempt:', error);
        },
      });
  }
}
