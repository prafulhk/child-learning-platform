import { ChangeDetectorRef, Component, inject, OnDestroy, HostListener } from '@angular/core';

import {
  OLYMPIAD_ASSESSMENT_CONFIG,
  type ActiveAssessmentSession,
  type AssessmentAttempt,
  type AssessmentDefinition,
  type AssessmentQuestionSnapshot,
} from './core/models/assessment.model';

import type { PracticeAttempt } from './core/services/local-storage.service';

import { AssessmentService } from './core/services/assessment.service';
import { QuestionService } from './core/services/question.service';

import { AssessmentHomeComponent } from './features/assessment/assessment-home.component';
import { AssessmentSessionComponent } from './features/assessment/assessment-session.component';

import { PracticeAttemptDetailComponent } from './features/practice/practice-attempt-detail.component';
import { PracticeHistoryComponent } from './features/practice/practice-history.component';
import { PracticeHomeComponent } from './features/practice/practice-home.component';
import { PracticeSessionComponent } from './features/practice/practice-session.component';

import { ParentToolsComponent } from './features/parent-tools/parent-tools.component';
import { QuestionBankComponent } from './features/question-bank/question-bank.component';
import { LocalStorageService } from './core/services/local-storage.service';
import { PracticeResultComponent } from './features/practice/practice-result.component';

type AppView =
  | 'HOME'
  | 'PRACTICE'
  | 'HISTORY'
  | 'DETAIL'
  | 'PARENT_TOOLS'
  | 'QUESTION_BANK'
  | 'ASSESSMENT_HOME'
  | 'ASSESSMENT_SESSION'
  | 'ASSESSMENT_RESULT';

@Component({
  imports: [
    AssessmentHomeComponent,
    AssessmentSessionComponent,
    PracticeHomeComponent,
    PracticeSessionComponent,
    PracticeHistoryComponent,
    PracticeAttemptDetailComponent,
    ParentToolsComponent,
    QuestionBankComponent,
    PracticeResultComponent,
  ],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App implements OnDestroy {
  view: AppView = 'HOME';

  selectedAttempt: PracticeAttempt | null = null;

  activeAssessmentSession: ActiveAssessmentSession | null = null;

  assessmentError = '';

  assessmentRemainingSeconds = 0;

  private assessmentCountdownTimerId: ReturnType<typeof window.setInterval> | null = null;

  private readonly assessmentCountdownTickMs = 250;

  private readonly assessmentService = inject(AssessmentService);

  private readonly questionService = inject(QuestionService);

  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly localStorageService = inject(LocalStorageService);

  completedAssessmentAttempt: AssessmentAttempt | null = null;

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

  onStartPractice(): void {
    this.stopAssessmentCountdown();

    this.selectedAttempt = null;
    this.view = 'PRACTICE';
  }

  onViewHistory(): void {
    this.stopAssessmentCountdown();

    this.selectedAttempt = null;
    this.view = 'HISTORY';
  }

  onBackToHome(): void {
    this.stopAssessmentCountdown();

    this.selectedAttempt = null;
    this.activeAssessmentSession = null;
    this.completedAssessmentAttempt = null;
    this.assessmentCompletionLocked = false;
    this.assessmentRemainingSeconds = 0;
    this.assessmentError = '';
    this.view = 'HOME';
  }

  onOpenParentTools(): void {
    this.stopAssessmentCountdown();

    this.selectedAttempt = null;
    this.view = 'PARENT_TOOLS';
  }

  onOpenQuestionBank(): void {
    this.stopAssessmentCountdown();

    this.selectedAttempt = null;
    this.view = 'QUESTION_BANK';
  }

  onBackToParentTools(): void {
    this.stopAssessmentCountdown();

    this.selectedAttempt = null;
    this.view = 'PARENT_TOOLS';
  }

  onOpenAssessment(): void {
    this.stopAssessmentCountdown();

    this.selectedAttempt = null;
    this.activeAssessmentSession = null;
    this.completedAssessmentAttempt = null;
    this.assessmentCompletionLocked = false;
    this.assessmentRemainingSeconds = 0;
    this.assessmentError = '';
    this.view = 'ASSESSMENT_HOME';
  }

  onStartAssessment(): void {
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

      this.view = 'ASSESSMENT_SESSION';
      this.startAssessmentCountdown();
    } catch (error) {
      this.assessmentError =
        error instanceof Error
          ? error.message
          : 'Unable to start the assessment. Please try again.';

      this.view = 'ASSESSMENT_HOME';
    }
  }

  onAssessmentOptionSelected(optionId: string): void {
    this.syncAssessmentTimer();

    const session = this.activeAssessmentSession;

    if (
      !session ||
      this.view !== 'ASSESSMENT_SESSION' ||
      this.assessmentRemainingSeconds === 0 ||
      this.assessmentAnswerTransitioning
    ) {
      return;
    }

    const currentQuestion = session.questions[session.currentQuestionIndex];

    if (!currentQuestion) {
      return;
    }

    // Save selected answer
    session.selectedAnswers = {
      ...session.selectedAnswers,
      [currentQuestion.questionId]: optionId,
    };

    // Show selected option before moving forward
    this.assessmentAnswerTransitioning = true;

    setTimeout(() => {
      this.assessmentAnswerTransitioning = false;

      if (
        !this.activeAssessmentSession ||
        this.view !== 'ASSESSMENT_SESSION' ||
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

    if (!session || this.view !== 'ASSESSMENT_SESSION' || this.assessmentRemainingSeconds === 0) {
      return;
    }

    if (session.currentQuestionIndex > 0) {
      session.currentQuestionIndex -= 1;
    }
  }

  onAssessmentFlag(): void {
    this.syncAssessmentTimer();

    const session = this.activeAssessmentSession;

    if (!session || this.view !== 'ASSESSMENT_SESSION' || this.assessmentRemainingSeconds === 0) {
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

  onViewAttempt(attempt: PracticeAttempt): void {
    this.stopAssessmentCountdown();

    this.selectedAttempt = attempt;
    this.view = 'DETAIL';
  }

  onBackToHistory(): void {
    this.stopAssessmentCountdown();

    this.view = 'HISTORY';
  }

  private startAssessmentCountdown(): void {
    this.stopAssessmentCountdown();

    this.syncAssessmentTimer();

    if (!this.activeAssessmentSession || this.view !== 'ASSESSMENT_SESSION') {
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
    if (!this.activeAssessmentSession || this.view !== 'ASSESSMENT_SESSION') {
      return;
    }

    this.syncAssessmentTimer();

    if (!this.activeAssessmentSession || this.view !== 'ASSESSMENT_SESSION') {
      return;
    }

    this.startAssessmentCountdown();
  }

  private syncAssessmentTimer(): void {
    const session = this.activeAssessmentSession;

    if (!session || this.view !== 'ASSESSMENT_SESSION') {
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

    this.view = 'ASSESSMENT_RESULT';
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

  onSubmitAssessment(): void {
    this.syncAssessmentTimer();

    if (this.view === 'ASSESSMENT_RESULT') {
      return;
    }

    if (this.completeAssessment()) {
      this.view = 'ASSESSMENT_RESULT';
    }
  }

  onAssessmentNext(): void {
    this.syncAssessmentTimer();

    const session = this.activeAssessmentSession;

    if (!session || this.view !== 'ASSESSMENT_SESSION' || this.assessmentRemainingSeconds === 0) {
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
}
