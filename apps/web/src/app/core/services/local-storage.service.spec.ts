import { TestBed } from '@angular/core/testing';
import { Question, QuestionSourceMetadata } from '../models/question.model';
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

  it('saves and loads Question Bank questions', () => {
    const questions: Question[] = [
      {
        id: 'q001',
        type: 'SIMPLE_ARITHMETIC',
        subjectId: 'abacus',
        topicId: 'single-digit-addition',
        difficulty: 'EASY',
        rows: [{ value: 3 }, { value: 2 }, { value: 4 }],
        options: [
          { id: 'opt_a', value: 4 },
          { id: 'opt_b', value: 7 },
          { id: 'opt_c', value: 8 },
          { id: 'opt_d', value: 9 },
        ],
        correctOptionId: 'opt_d',
        explanation: '3 + 2 + 4 = 9',
        createdAt: '2026-09-19T00:00:00Z',
      },
    ];

    service.saveQuestionBankQuestions('single-digit-addition', questions);

    expect(service.getQuestionBankQuestions('single-digit-addition')).toEqual(questions);
  });

  it('loads the same Question Bank questions after a new service instance is created', () => {
    const questions: Question[] = [
      {
        id: 'q002',
        type: 'SIMPLE_ARITHMETIC',
        subjectId: 'abacus',
        topicId: 'single-digit-addition',
        difficulty: 'MEDIUM',
        rows: [{ value: 5 }, { value: 2 }, { value: 1 }],
        options: [
          { id: 'opt_a', value: 6 },
          { id: 'opt_b', value: 7 },
          { id: 'opt_c', value: 8 },
          { id: 'opt_d', value: 9 },
        ],
        correctOptionId: 'opt_b',
        explanation: '5 + 2 + 1 = 8',
        createdAt: '2026-09-19T01:00:00Z',
      },
    ];

    service.saveQuestionBankQuestions('single-digit-addition', questions);

    const nextService = new LocalStorageService();

    expect(nextService.getQuestionBankQuestions('single-digit-addition')).toEqual(questions);
  });

  it('isolates Question Bank storage by topic', () => {
    const additionQuestions: Question[] = [
      {
        id: 'q-add',
        type: 'SIMPLE_ARITHMETIC',
        subjectId: 'abacus',
        topicId: 'single-digit-addition',
        difficulty: 'EASY',
        rows: [{ value: 1 }, { value: 2 }],
        options: [
          { id: 'opt_a', value: 1 },
          { id: 'opt_b', value: 2 },
          { id: 'opt_c', value: 3 },
          { id: 'opt_d', value: 4 },
        ],
        correctOptionId: 'opt_c',
        createdAt: '2026-09-19T00:00:00Z',
      },
    ];

    const subtractionQuestions: Question[] = [
      {
        id: 'q-sub',
        type: 'SIMPLE_ARITHMETIC',
        subjectId: 'abacus',
        topicId: 'single-digit-subtraction',
        difficulty: 'EASY',
        rows: [{ value: 5 }, { value: 2, operator: '-' }],
        options: [
          { id: 'opt_a', value: 2 },
          { id: 'opt_b', value: 3 },
          { id: 'opt_c', value: 4 },
          { id: 'opt_d', value: 5 },
        ],
        correctOptionId: 'opt_b',
        createdAt: '2026-09-19T00:00:00Z',
      },
    ];

    service.saveQuestionBankQuestions('single-digit-addition', additionQuestions);
    service.saveQuestionBankQuestions('single-digit-subtraction', subtractionQuestions);

    expect(service.getQuestionBankQuestions('single-digit-addition')).toEqual(additionQuestions);
    expect(service.getQuestionBankQuestions('single-digit-subtraction')).toEqual(
      subtractionQuestions,
    );
  });

  it('handles invalid Question Bank JSON safely', () => {
    localStorage.setItem('child-learning.question-bank.v1', '{not valid json');

    expect(service.getQuestionBankQuestions('single-digit-addition')).toEqual([]);
  });

  it('preserves complete Question objects', () => {
    const question: Question = {
      id: 'q-preserve',
      type: 'SIMPLE_ARITHMETIC',
      subjectId: 'abacus',
      topicId: 'single-digit-addition',
      difficulty: 'HARD',
      rows: [{ value: 3 }, { value: 2, operator: '-' }, { value: 4 }],
      options: [
        { id: 'opt_a', value: 1 },
        { id: 'opt_b', value: 2 },
        { id: 'opt_c', value: 3 },
        { id: 'opt_d', value: 4 },
      ],
      correctOptionId: 'opt_d',
      explanation: '3 - 2 + 4 = 5',
      createdAt: '2026-09-19T02:00:00Z',
    };

    service.saveQuestionBankQuestions('single-digit-addition', [question]);

    expect(service.getQuestionBankQuestions('single-digit-addition')).toEqual([question]);
  });

  it('preserves question IDs, option IDs, rows, and explicit subtraction operators', () => {
    const question: Question = {
      id: 'q-ids',
      type: 'SIMPLE_ARITHMETIC',
      subjectId: 'abacus',
      topicId: 'single-digit-addition',
      difficulty: 'MEDIUM',
      rows: [{ value: 6 }, { value: 1, operator: '-' }, { value: 2 }],
      options: [
        { id: 'opt_1', value: 3 },
        { id: 'opt_2', value: 4 },
        { id: 'opt_3', value: 5 },
        { id: 'opt_4', value: 6 },
      ],
      correctOptionId: 'opt_3',
      createdAt: '2026-09-19T03:00:00Z',
    };

    service.saveQuestionBankQuestions('single-digit-addition', [question]);

    expect(service.getQuestionBankQuestions('single-digit-addition')[0]).toEqual(question);
  });

  it('preserves Question source metadata during save and load', () => {
    const source: QuestionSourceMetadata = {
      sourceType: 'IMAGE',
      originalFileName: 'math-sheet.jpg',
      importedAt: '2026-09-19T04:00:00Z',
    };

    const question: Question = {
      id: 'q-source',
      type: 'SIMPLE_ARITHMETIC',
      subjectId: 'abacus',
      topicId: 'single-digit-addition',
      difficulty: 'EASY',
      rows: [{ value: 2 }, { value: 3 }],
      options: [
        { id: 'opt_a', value: 3 },
        { id: 'opt_b', value: 4 },
        { id: 'opt_c', value: 5 },
        { id: 'opt_d', value: 6 },
      ],
      correctOptionId: 'opt_c',
      source,
      createdAt: '2026-09-19T04:00:00Z',
    };

    service.saveQuestionBankQuestions('single-digit-addition', [question]);

    expect(service.getQuestionBankQuestions('single-digit-addition')[0].source).toEqual(source);
  });
});
