import { Component, inject } from '@angular/core';

import {
  OLYMPIAD_ASSESSMENT_CONFIG,
  type ActiveAssessmentSession,
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

type AppView =
  | 'HOME'
  | 'PRACTICE'
  | 'HISTORY'
  | 'DETAIL'
  | 'PARENT_TOOLS'
  | 'QUESTION_BANK'
  | 'ASSESSMENT_HOME'
  | 'ASSESSMENT_SESSION';

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
  ],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  view: AppView = 'HOME';

  selectedAttempt: PracticeAttempt | null = null;

  activeAssessmentSession: ActiveAssessmentSession | null = null;

  assessmentError = '';

  private readonly assessmentService = inject(AssessmentService);

  private readonly questionService = inject(QuestionService);

  readonly olympiadDefinition: AssessmentDefinition = {
    id: 'olympiad-test',
    title: 'Abacus Olympiad Test',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    config: OLYMPIAD_ASSESSMENT_CONFIG,
  };

  onStartPractice(): void {
    this.selectedAttempt = null;
    this.view = 'PRACTICE';
  }

  onViewHistory(): void {
    this.selectedAttempt = null;
    this.view = 'HISTORY';
  }

  onBackToHome(): void {
    this.selectedAttempt = null;
    this.activeAssessmentSession = null;
    this.assessmentError = '';
    this.view = 'HOME';
  }

  onOpenParentTools(): void {
    this.selectedAttempt = null;
    this.view = 'PARENT_TOOLS';
  }

  onOpenQuestionBank(): void {
    this.selectedAttempt = null;
    this.view = 'QUESTION_BANK';
  }

  onBackToParentTools(): void {
    this.selectedAttempt = null;
    this.view = 'PARENT_TOOLS';
  }

  onOpenAssessment(): void {
    this.selectedAttempt = null;
    this.activeAssessmentSession = null;
    this.assessmentError = '';
    this.view = 'ASSESSMENT_HOME';
  }

  onStartAssessment(): void {
    this.activeAssessmentSession = null;
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
    } catch (error) {
      this.assessmentError =
        error instanceof Error
          ? error.message
          : 'Unable to start the assessment. Please try again.';

      this.view = 'ASSESSMENT_HOME';
    }
  }

  onAssessmentOptionSelected(optionId: string): void {
    const session = this.activeAssessmentSession;

    if (!session) {
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

    if (session.currentQuestionIndex < session.questions.length - 1) {
      session.currentQuestionIndex += 1;
    }
  }

  onAssessmentPrevious(): void {
    const session = this.activeAssessmentSession;

    if (!session) {
      return;
    }

    if (session.currentQuestionIndex > 0) {
      session.currentQuestionIndex -= 1;
    }
  }

  onAssessmentFlag(): void {
    const session = this.activeAssessmentSession;

    if (!session) {
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

  onViewAttempt(attempt: PracticeAttempt): void {
    this.selectedAttempt = attempt;
    this.view = 'DETAIL';
  }

  onBackToHistory(): void {
    this.view = 'HISTORY';
  }
}
