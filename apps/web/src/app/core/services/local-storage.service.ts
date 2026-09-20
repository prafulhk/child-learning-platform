import { Injectable } from '@angular/core';
import { Question } from '../models/question.model';
import type { AssessmentAttempt } from '../models/assessment.model';

export interface PresentedQuestionSnapshot {
  questionId: string;
  questionSnapshot: Question;
}

export interface PracticeResult {
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  accuracyPercentage: number;
}

export interface ActivePracticeSession {
  topicId: string;
  startedAt: string;
  endsAt: string;
  currentQuestionIndex: number;
  presentedQuestions: PresentedQuestionSnapshot[];
  selectedAnswers: Record<string, string>;
}

export interface PracticeAttempt {
  id: string;
  topicId: string;
  startedAt: string;
  completedAt: string;
  presentedQuestions: PresentedQuestionSnapshot[];
  selectedAnswers: Record<string, string>;
  result: PracticeResult;
}

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private readonly activeSessionKey = 'practice.activeSession';
  private readonly attemptsKey = 'practice.completedAttempts';
  private readonly questionBankKey = 'child-learning.question-bank.v1';
  private readonly assessmentAttemptsKey = 'assessment.completedAttempts';

  saveActiveSession(session: ActivePracticeSession): void {
    localStorage.setItem(this.activeSessionKey, JSON.stringify(session));
  }

  getActiveSession(): ActivePracticeSession | null {
    const raw = localStorage.getItem(this.activeSessionKey);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as ActivePracticeSession;
    } catch {
      return null;
    }
  }

  clearActiveSession(): void {
    localStorage.removeItem(this.activeSessionKey);
  }

  saveCompletedAttempt(attempt: PracticeAttempt): void {
    const existing = this.getCompletedAttempts();
    existing.push(attempt);
    localStorage.setItem(this.attemptsKey, JSON.stringify(existing));
  }

  getCompletedAttempts(): PracticeAttempt[] {
    const raw = localStorage.getItem(this.attemptsKey);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as PracticeAttempt[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  getCompletedAttemptById(attemptId: string): PracticeAttempt | null {
    const attempts = this.getCompletedAttempts();
    return attempts.find((a) => a.id === attemptId) ?? null;
  }

  saveCompletedAssessmentAttempt(attempt: AssessmentAttempt): void {
    const existing = this.getCompletedAssessmentAttempts();

    existing.push(attempt);

    localStorage.setItem(this.assessmentAttemptsKey, JSON.stringify(existing));
  }

  getCompletedAssessmentAttempts(): AssessmentAttempt[] {
    const raw = localStorage.getItem(this.assessmentAttemptsKey);

    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as AssessmentAttempt[];

      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  saveQuestionBankQuestions(topicId: string, questions: Question[]): void {
    const currentQuestionBank = this.getQuestionBankStorage();
    currentQuestionBank[topicId] = JSON.parse(JSON.stringify(questions)) as Question[];
    localStorage.setItem(this.questionBankKey, JSON.stringify(currentQuestionBank));
  }

  getQuestionBankQuestions(topicId: string): Question[] {
    const currentQuestionBank = this.getQuestionBankStorage();
    const questions = currentQuestionBank[topicId];

    if (!Array.isArray(questions)) {
      return [];
    }

    return JSON.parse(JSON.stringify(questions)) as Question[];
  }

  private getQuestionBankStorage(): Record<string, Question[]> {
    const raw = localStorage.getItem(this.questionBankKey);

    if (!raw) {
      return {};
    }

    try {
      const parsed = JSON.parse(raw) as Record<string, Question[]>;

      if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
        return {};
      }

      return parsed;
    } catch {
      return {};
    }
  }
}
