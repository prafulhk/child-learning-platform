import { Injectable } from '@angular/core';
import { Question } from '../models/question.model';
import { QuestionService } from './question.service';
import {
  ActivePracticeSession,
  LocalStorageService,
  PracticeAttempt,
  PracticeResult,
  PresentedQuestionSnapshot,
} from './local-storage.service';

@Injectable({ providedIn: 'root' })
export class PracticeService {
  private activeSession: ActivePracticeSession | null = null;
  private readonly practiceDurationMs = 5 * 60 * 1000;

  constructor(
    private readonly questionService: QuestionService,
    private readonly localStorageService: LocalStorageService,
  ) {}

  startPractice(topicId = 'single-digit-addition'): ActivePracticeSession {
    const selectedQuestions = this.questionService.getRandomQuestions(10, topicId);

    const shuffledQuestions = this.shuffleOnce(this.deepClone(selectedQuestions));

    const presentedQuestions: PresentedQuestionSnapshot[] = shuffledQuestions.map((question) => {
      const shuffledOptions = this.shuffleOnce(this.deepClone(question.options));

      const snapshot: Question = {
        ...this.deepClone(question),
        options: shuffledOptions,
      };

      return {
        questionId: snapshot.id,
        questionSnapshot: snapshot,
      };
    });

    this.activeSession = {
      topicId,
      startedAt: new Date().toISOString(),
      endsAt: new Date(Date.now() + this.practiceDurationMs).toISOString(),
      currentQuestionIndex: 0,
      presentedQuestions,
      selectedAnswers: {},
    };

    this.localStorageService.saveActiveSession(this.deepClone(this.activeSession));

    return this.deepClone(this.activeSession);
  }

  getSession(): ActivePracticeSession | null {
    if (this.activeSession) {
      return this.deepClone(this.activeSession);
    }

    const stored = this.localStorageService.getActiveSession();
    this.activeSession = stored ? this.deepClone(stored) : null;
    return this.activeSession ? this.deepClone(this.activeSession) : null;
  }

  getCurrentQuestion(): PresentedQuestionSnapshot | null {
    const session = this.getSession();
    if (!session) {
      return null;
    }

    return session.presentedQuestions[session.currentQuestionIndex] ?? null;
  }

  getCurrentQuestionIndex(): number {
    const session = this.getSession();
    return session ? session.currentQuestionIndex : -1;
  }

  getRemainingSeconds(session: ActivePracticeSession | null = this.getSession()): number {
    if (!session) {
      return 0;
    }

    const remainingMilliseconds = new Date(session.endsAt).getTime() - Date.now();
    return Math.max(0, Math.floor(remainingMilliseconds / 1000));
  }

  isSessionExpired(session: ActivePracticeSession | null = this.getSession()): boolean {
    if (!session) {
      return true;
    }

    return this.getRemainingSeconds(session) === 0;
  }

  recordAnswer(questionId: string, selectedOptionId: string): void {
    const session = this.ensureSession();

    if (this.isSessionExpired(session)) {
      return;
    }

    session.selectedAnswers[questionId] = selectedOptionId;

    if (session.currentQuestionIndex < session.presentedQuestions.length - 1) {
      session.currentQuestionIndex += 1;
    }

    this.persistActiveSession(session);
  }

  goToPrevious(): PresentedQuestionSnapshot | null {
    const session = this.ensureSession();

    if (this.isSessionExpired(session)) {
      return null;
    }

    if (session.currentQuestionIndex > 0) {
      session.currentQuestionIndex -= 1;
      this.persistActiveSession(session);
    }

    return this.deepClone(session.presentedQuestions[session.currentQuestionIndex] ?? null);
  }

  completePractice(): PracticeAttempt {
    const session = this.ensureSession();

    const result = this.calculateResult(session);

    const attempt: PracticeAttempt = {
      id: this.generateAttemptId(),
      topicId: session.topicId,
      startedAt: session.startedAt,
      completedAt: new Date().toISOString(),
      presentedQuestions: this.deepClone(session.presentedQuestions),
      selectedAnswers: this.deepClone(session.selectedAnswers),
      result,
    };

    this.localStorageService.saveCompletedAttempt(this.deepClone(attempt));
    this.localStorageService.clearActiveSession();
    this.activeSession = null;

    return attempt;
  }

  private calculateResult(session: ActivePracticeSession): PracticeResult {
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    for (const presented of session.presentedQuestions) {
      const selected = session.selectedAnswers[presented.questionId];
      const expected = presented.questionSnapshot.correctOptionId;

      if (!selected) {
        unansweredCount += 1;
      } else if (selected === expected) {
        correctCount += 1;
      } else {
        incorrectCount += 1;
      }
    }

    const totalQuestions = session.presentedQuestions.length;
    const accuracyPercentage =
      totalQuestions === 0 ? 0 : Number(((correctCount / totalQuestions) * 100).toFixed(2));

    return {
      totalQuestions,
      correctCount,
      incorrectCount,
      unansweredCount,
      accuracyPercentage,
    };
  }

  private persistActiveSession(session: ActivePracticeSession): void {
    this.activeSession = this.deepClone(session);
    this.localStorageService.saveActiveSession(this.deepClone(session));
  }

  private ensureSession(): ActivePracticeSession {
    const session = this.getSession();
    if (!session) {
      throw new Error('No active practice session found.');
    }

    return session;
  }

  private shuffleOnce<T>(items: T[]): T[] {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  private generateAttemptId(): string {
    return `attempt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }

  private deepClone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
  }
}
