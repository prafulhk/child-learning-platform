import { TestBed } from '@angular/core/testing';
import {
  ActivePracticeSession,
  LocalStorageService,
  PracticeAttempt,
} from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
    localStorage.clear();
  });

  it('saves and gets active session', () => {
    const session: ActivePracticeSession = {
      topicId: 'single-digit-addition',
      startedAt: '2026-09-19T00:00:00Z',
      endsAt: '2026-09-19T00:05:00Z',
      currentQuestionIndex: 1,
      presentedQuestions: [],
      selectedAnswers: { q001: 'opt_a' },
    };

    service.saveActiveSession(session);
    const loaded = service.getActiveSession();

    expect(loaded).toEqual(session);
  });

  it('clears active session', () => {
    const session: ActivePracticeSession = {
      topicId: 'single-digit-addition',
      startedAt: '2026-09-19T00:00:00Z',
      endsAt: '2026-09-19T00:05:00Z',
      currentQuestionIndex: 0,
      presentedQuestions: [],
      selectedAnswers: {},
    };

    service.saveActiveSession(session);
    service.clearActiveSession();

    expect(service.getActiveSession()).toBeNull();
  });

  it('saves and gets completed attempts', () => {
    const attempt: PracticeAttempt = {
      id: 'attempt_1',
      topicId: 'single-digit-addition',
      startedAt: '2026-09-19T00:00:00Z',
      completedAt: '2026-09-19T00:05:00Z',
      presentedQuestions: [],
      selectedAnswers: { q001: 'opt_b' },
      result: {
        totalQuestions: 10,
        correctCount: 7,
        incorrectCount: 2,
        unansweredCount: 1,
        accuracyPercentage: 70,
      },
    };

    service.saveCompletedAttempt(attempt);

    const all = service.getCompletedAttempts();
    expect(all.length).toBe(1);
    expect(all[0]).toEqual(attempt);
  });

  it('gets attempt by ID', () => {
    const attempt: PracticeAttempt = {
      id: 'attempt_2',
      topicId: 'single-digit-addition',
      startedAt: '2026-09-19T00:00:00Z',
      completedAt: '2026-09-19T00:05:00Z',
      presentedQuestions: [],
      selectedAnswers: {},
      result: {
        totalQuestions: 10,
        correctCount: 10,
        incorrectCount: 0,
        unansweredCount: 0,
        accuracyPercentage: 100,
      },
    };

    service.saveCompletedAttempt(attempt);

    expect(service.getCompletedAttemptById('attempt_2')).toEqual(attempt);
    expect(service.getCompletedAttemptById('missing')).toBeNull();
  });

  it('returns null/empty safely for missing storage keys', () => {
    expect(service.getActiveSession()).toBeNull();
    expect(service.getCompletedAttempts()).toEqual([]);
    expect(service.getCompletedAttemptById('missing')).toBeNull();
  });
});
