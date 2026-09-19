import { TestBed } from '@angular/core/testing';

import { AssessmentService } from './assessment.service';

import type { AssessmentDefinition } from '../models/assessment.model';
import type { SimpleArithmeticQuestion } from '../models/question.model';

describe('AssessmentService', () => {
  let service: AssessmentService;

  const createQuestion = (id: string, firstValue: number = 1): SimpleArithmeticQuestion => ({
    id,
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'EASY',
    rows: [{ value: firstValue }, { value: 1 }, { value: 1 }],
    options: [
      { id: `${id}-a`, value: firstValue },
      { id: `${id}-b`, value: firstValue + 1 },
      { id: `${id}-c`, value: firstValue + 2 },
      { id: `${id}-d`, value: firstValue + 3 },
    ],
    correctOptionId: `${id}-c`,
    createdAt: '2026-09-20T00:00:00.000Z',
  });

  const createQuestionPool = (count: number): SimpleArithmeticQuestion[] =>
    Array.from({ length: count }, (_, index) => createQuestion(`q${index + 1}`, index + 1));

  const randomDefinition: AssessmentDefinition = {
    id: 'olympiad-test',
    title: 'Abacus Olympiad Test',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    config: {
      questionCount: 100,
      durationSeconds: 900,
      selectionMode: 'RANDOM',
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssessmentService],
    });

    service = TestBed.inject(AssessmentService);
  });

  it('creates a 100-question assessment session', () => {
    const session = service.createSession(
      randomDefinition,
      createQuestionPool(120),
      '2026-09-20T10:00:00.000Z',
    );

    expect(session.assessmentId).toBe('olympiad-test');
    expect(session.questions).toHaveLength(100);
    expect(session.currentQuestionIndex).toBe(0);
    expect(session.selectedAnswers).toEqual({});
    expect(session.flaggedQuestionIds).toEqual([]);
  });

  it('sets the assessment end time from the configured duration', () => {
    const session = service.createSession(
      randomDefinition,
      createQuestionPool(100),
      '2026-09-20T10:00:00.000Z',
    );

    expect(session.startedAt).toBe('2026-09-20T10:00:00.000Z');

    expect(session.endsAt).toBe('2026-09-20T10:15:00.000Z');
  });

  it('selects unique questions for random assessments', () => {
    const session = service.createSession(
      randomDefinition,
      createQuestionPool(120),
      '2026-09-20T10:00:00.000Z',
    );

    const ids = session.questions.map((question) => question.questionId);

    expect(new Set(ids).size).toBe(100);
  });

  it('does not mutate the original question objects', () => {
    const questionPool = createQuestionPool(100);
    const originalRows = questionPool[0].rows;
    const originalOptions = questionPool[0].options;

    const session = service.createSession(
      randomDefinition,
      questionPool,
      '2026-09-20T10:00:00.000Z',
    );

    const snapshot = session.questions.find(
      (question) => question.questionId === questionPool[0].id,
    );

    expect(snapshot).toBeDefined();
    expect(snapshot!.questionSnapshot.rows).not.toBe(originalRows);
    expect(snapshot!.questionSnapshot.options).not.toBe(originalOptions);
  });

  it('rejects a question pool that is too small', () => {
    expect(() =>
      service.createSession(randomDefinition, createQuestionPool(99), '2026-09-20T10:00:00.000Z'),
    ).toThrow('Not enough unique questions. Required 100, available 99.');
  });

  it('supports configurable question counts and durations', () => {
    const definition: AssessmentDefinition = {
      ...randomDefinition,
      id: 'quick-test',
      title: 'Quick Test',
      config: {
        questionCount: 20,
        durationSeconds: 600,
        selectionMode: 'RANDOM',
      },
    };

    const session = service.createSession(
      definition,
      createQuestionPool(20),
      '2026-09-20T10:00:00.000Z',
    );

    expect(session.questions).toHaveLength(20);
    expect(session.endsAt).toBe('2026-09-20T10:10:00.000Z');
  });

  it('creates fixed assessments in the configured question order', () => {
    const definition: AssessmentDefinition = {
      ...randomDefinition,
      id: 'fixed-test',
      config: {
        questionCount: 3,
        durationSeconds: 300,
        selectionMode: 'FIXED',
      },
      questionIds: ['q5', 'q2', 'q8'],
    };

    const session = service.createSession(
      definition,
      createQuestionPool(10),
      '2026-09-20T10:00:00.000Z',
    );

    expect(session.questions.map((question) => question.questionId)).toEqual(['q5', 'q2', 'q8']);
  });

  it('rejects fixed assessments with the wrong number of question IDs', () => {
    const definition: AssessmentDefinition = {
      ...randomDefinition,
      id: 'invalid-fixed-test',
      config: {
        questionCount: 3,
        durationSeconds: 300,
        selectionMode: 'FIXED',
      },
      questionIds: ['q1', 'q2'],
    };

    expect(() =>
      service.createSession(definition, createQuestionPool(10), '2026-09-20T10:00:00.000Z'),
    ).toThrow('Fixed assessment questionIds must match questionCount.');
  });

  it('rejects duplicate fixed question IDs', () => {
    const definition: AssessmentDefinition = {
      ...randomDefinition,
      id: 'duplicate-fixed-test',
      config: {
        questionCount: 3,
        durationSeconds: 300,
        selectionMode: 'FIXED',
      },
      questionIds: ['q1', 'q1', 'q2'],
    };

    expect(() =>
      service.createSession(definition, createQuestionPool(10), '2026-09-20T10:00:00.000Z'),
    ).toThrow('A fixed assessment cannot contain duplicate question IDs.');
  });
});
