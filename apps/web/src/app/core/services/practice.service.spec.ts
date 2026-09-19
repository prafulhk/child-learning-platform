import { TestBed } from '@angular/core/testing';
import { QUESTIONS_SEED } from '../../data/questions.seed';
import { Question } from '../models/question.model';
import {
  ActivePracticeSession,
  LocalStorageService,
  PracticeAttempt,
} from './local-storage.service';
import { PracticeService } from './practice.service';
import { QuestionService } from './question.service';

class MockQuestionService {
  constructor(private readonly questions: Question[]) {}

  getRandomQuestions(count: number, topicId?: string): Question[] {
    const filtered = topicId ? this.questions.filter((q) => q.topicId === topicId) : this.questions;
    return filtered.slice(0, count).map((q) => JSON.parse(JSON.stringify(q)) as Question);
  }
}

class MockLocalStorageService {
  activeSession: ActivePracticeSession | null = null;
  attempts: PracticeAttempt[] = [];

  saveActiveSession(session: ActivePracticeSession): void {
    this.activeSession = JSON.parse(JSON.stringify(session)) as ActivePracticeSession;
  }

  getActiveSession(): ActivePracticeSession | null {
    return this.activeSession
      ? (JSON.parse(JSON.stringify(this.activeSession)) as ActivePracticeSession)
      : null;
  }

  clearActiveSession(): void {
    this.activeSession = null;
  }

  saveCompletedAttempt(attempt: PracticeAttempt): void {
    this.attempts.push(JSON.parse(JSON.stringify(attempt)) as PracticeAttempt);
  }

  getCompletedAttempts(): PracticeAttempt[] {
    return JSON.parse(JSON.stringify(this.attempts)) as PracticeAttempt[];
  }

  getCompletedAttemptById(attemptId: string): PracticeAttempt | null {
    return this.attempts.find((a) => a.id === attemptId) ?? null;
  }
}

function fisherYatesOnce<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

describe('PracticeService', () => {
  const baseQuestions = QUESTIONS_SEED.slice(0, 12).map(
    (q) => JSON.parse(JSON.stringify(q)) as Question,
  );
  let service: PracticeService;
  let localStorageService: MockLocalStorageService;

  beforeEach(() => {
    localStorageService = new MockLocalStorageService();

    TestBed.configureTestingModule({
      providers: [
        PracticeService,
        { provide: QuestionService, useValue: new MockQuestionService(baseQuestions) },
        { provide: LocalStorageService, useValue: localStorageService },
      ],
    });

    service = TestBed.inject(PracticeService);
  });

  it('starts with 10 questions and unique question IDs', () => {
    const session = service.startPractice('single-digit-addition');

    expect(session.presentedQuestions.length).toBe(10);
    const ids = session.presentedQuestions.map((p) => p.questionId);
    expect(new Set(ids).size).toBe(10);
  });

  it('question order is shuffled once and option order is shuffled once', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.12);

    const selected = baseQuestions.slice(0, 10);
    const expectedQuestionOrder = fisherYatesOnce(selected).map((q) => q.id);

    const expectedOptionOrderByQuestionId = new Map<string, string[]>();
    for (const question of fisherYatesOnce(selected)) {
      const shuffledOptions = fisherYatesOnce(question.options);
      expectedOptionOrderByQuestionId.set(
        question.id,
        shuffledOptions.map((opt) => opt.id),
      );
    }

    const session = service.startPractice('single-digit-addition');
    const actualQuestionOrder = session.presentedQuestions.map((p) => p.questionId);

    expect(actualQuestionOrder).toEqual(expectedQuestionOrder);

    for (const presented of session.presentedQuestions) {
      const expectedOptionIds = expectedOptionOrderByQuestionId.get(presented.questionId);
      const actualOptionIds = presented.questionSnapshot.options.map((o) => o.id);
      expect(actualOptionIds).toEqual(expectedOptionIds);
    }

    randomSpy.mockRestore();
  });

  it('correctOptionId remains unchanged after option shuffle', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.33);

    const session = service.startPractice('single-digit-addition');

    for (const presented of session.presentedQuestions) {
      const original = baseQuestions.find((q) => q.id === presented.questionId);
      expect(presented.questionSnapshot.correctOptionId).toBe(original?.correctOptionId);
    }

    randomSpy.mockRestore();
  });

  it('presented snapshot contains final shuffled option order and seed data is not mutated', () => {
    const seedBefore = JSON.stringify(QUESTIONS_SEED);
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.42);

    const session = service.startPractice('single-digit-addition');

    for (const presented of session.presentedQuestions) {
      const original = baseQuestions.find((q) => q.id === presented.questionId);
      expect(presented.questionSnapshot.options).not.toEqual(original?.options);
    }

    expect(JSON.stringify(QUESTIONS_SEED)).toBe(seedBefore);

    randomSpy.mockRestore();
  });

  it('recordAnswer stores by questionId and preserves selected answer', () => {
    const session = service.startPractice('single-digit-addition');
    const firstQuestion = session.presentedQuestions[0];
    const selectedOption = firstQuestion.questionSnapshot.options[0].id;

    service.recordAnswer(firstQuestion.questionId, selectedOption);

    const updated = service.getSession();
    expect(updated?.selectedAnswers[firstQuestion.questionId]).toBe(selectedOption);
  });

  it('goToPrevious returns to previous question', () => {
    const session = service.startPractice('single-digit-addition');

    // Move from question 0 -> 1 by updating the actual in-memory service state
    // used by goToPrevious(), not a copied session snapshot.
    const state = (service as unknown as { activeSession: ActivePracticeSession | null })
      .activeSession;
    if (!state) {
      throw new Error('Expected activeSession to be initialized by startPractice');
    }
    state.currentQuestionIndex = 1;

    const previous = service.goToPrevious();
    const currentIndex = service.getCurrentQuestionIndex();

    expect(currentIndex).toBe(0);
    expect(previous?.questionId).toBe(session.presentedQuestions[0].questionId);
  });

  it('completion calculates correct/incorrect/unanswered and accuracy correctly', () => {
    const session = service.startPractice('single-digit-addition');

    const q1 = session.presentedQuestions[0];
    const q2 = session.presentedQuestions[1];
    const q3 = session.presentedQuestions[2];

    service.recordAnswer(q1.questionId, q1.questionSnapshot.correctOptionId); // correct

    const wrongForQ2 = q2.questionSnapshot.options.find(
      (o) => o.id !== q2.questionSnapshot.correctOptionId,
    )?.id;
    if (!wrongForQ2) {
      throw new Error('Expected at least one wrong option for q2');
    }
    service.recordAnswer(q2.questionId, wrongForQ2); // incorrect

    // q3 unanswered

    // mark rest unanswered
    const attempt = service.completePractice();

    expect(attempt.result.totalQuestions).toBe(10);
    expect(attempt.result.correctCount).toBe(1);
    expect(attempt.result.incorrectCount).toBe(1);
    expect(attempt.result.unansweredCount).toBe(8);
    expect(attempt.result.accuracyPercentage).toBe(10);
  });

  it('completed attempt preserves exact snapshots and is persisted; active session is cleared', () => {
    const session = service.startPractice('single-digit-addition');
    const beforeCompleteSnapshots = JSON.parse(JSON.stringify(session.presentedQuestions));

    const first = session.presentedQuestions[0];
    service.recordAnswer(first.questionId, first.questionSnapshot.correctOptionId);

    const attempt = service.completePractice();

    expect(attempt.presentedQuestions).toEqual(beforeCompleteSnapshots);
    expect(attempt.selectedAnswers[first.questionId]).toBe(first.questionSnapshot.correctOptionId);

    const persistedAttempts = localStorageService.getCompletedAttempts();
    expect(persistedAttempts.length).toBe(1);
    expect(persistedAttempts[0].id).toBe(attempt.id);
    expect(persistedAttempts[0].presentedQuestions).toEqual(beforeCompleteSnapshots);

    expect(localStorageService.getActiveSession()).toBeNull();
    expect(service.getSession()).toBeNull();
  });
});
