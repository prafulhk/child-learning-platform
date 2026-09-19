import { SimpleArithmeticQuestion } from '../core/models/question.model';

/**
 * Seeded Question Bank: Single-Digit Addition
 *
 * 20+ questions for Increment 1A practice.
 * All addition (no subtraction in 1A seed).
 * Variety of 2-row and 3-row questions.
 * Distribution: 7 EASY, 7 MEDIUM, 6+ HARD.
 *
 * Every question verified:
 * rows → calculated answer → matching option → correctOptionId → explanation
 */
export const QUESTIONS_SEED: SimpleArithmeticQuestion[] = [
  // EASY (7 questions)
  {
    id: 'q001',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'EASY',
    rows: [{ value: 1 }, { value: 1 }],
    options: [
      { id: 'opt_a', value: 1 },
      { id: 'opt_b', value: 2 },
      { id: 'opt_c', value: 3 },
      { id: 'opt_d', value: 4 },
    ],
    correctOptionId: 'opt_b', // 1 + 1 = 2
    explanation: '1 + 1 = 2',
    createdAt: '2026-09-19T00:00:00Z',
  },
  {
    id: 'q002',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'EASY',
    rows: [{ value: 2 }, { value: 1 }],
    options: [
      { id: 'opt_a', value: 1 },
      { id: 'opt_b', value: 2 },
      { id: 'opt_c', value: 3 },
      { id: 'opt_d', value: 4 },
    ],
    correctOptionId: 'opt_c', // 2 + 1 = 3
    explanation: '2 + 1 = 3',
    createdAt: '2026-09-19T00:00:00Z',
  },
  {
    id: 'q003',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'EASY',
    rows: [{ value: 1 }, { value: 2 }],
    options: [
      { id: 'opt_a', value: 2 },
      { id: 'opt_b', value: 3 },
      { id: 'opt_c', value: 4 },
      { id: 'opt_d', value: 5 },
    ],
    correctOptionId: 'opt_b', // 1 + 2 = 3
    explanation: '1 + 2 = 3',
    createdAt: '2026-09-19T00:00:00Z',
  },
  {
    id: 'q004',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'EASY',
    rows: [{ value: 2 }, { value: 2 }],
    options: [
      { id: 'opt_a', value: 2 },
      { id: 'opt_b', value: 3 },
      { id: 'opt_c', value: 4 },
      { id: 'opt_d', value: 5 },
    ],
    correctOptionId: 'opt_c', // 2 + 2 = 4
    explanation: '2 + 2 = 4',
    createdAt: '2026-09-19T00:00:00Z',
  },
  {
    id: 'q005',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'EASY',
    rows: [{ value: 3 }, { value: 1 }],
    options: [
      { id: 'opt_a', value: 3 },
      { id: 'opt_b', value: 4 },
      { id: 'opt_c', value: 5 },
      { id: 'opt_d', value: 6 },
    ],
    correctOptionId: 'opt_b', // 3 + 1 = 4
    explanation: '3 + 1 = 4',
    createdAt: '2026-09-19T00:00:00Z',
  },
  {
    id: 'q006',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'EASY',
    rows: [{ value: 1 }, { value: 3 }],
    options: [
      { id: 'opt_a', value: 3 },
      { id: 'opt_b', value: 4 },
      { id: 'opt_c', value: 5 },
      { id: 'opt_d', value: 6 },
    ],
    correctOptionId: 'opt_b', // 1 + 3 = 4
    explanation: '1 + 3 = 4',
    createdAt: '2026-09-19T00:00:00Z',
  },
  {
    id: 'q007',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'EASY',
    rows: [{ value: 2 }, { value: 3 }],
    options: [
      { id: 'opt_a', value: 4 },
      { id: 'opt_b', value: 5 },
      { id: 'opt_c', value: 6 },
      { id: 'opt_d', value: 7 },
    ],
    correctOptionId: 'opt_b', // 2 + 3 = 5
    explanation: '2 + 3 = 5',
    createdAt: '2026-09-19T00:00:00Z',
  },

  // MEDIUM (7 questions, include 3-row examples)
  {
    id: 'q008',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [{ value: 1 }, { value: 1 }, { value: 2 }],
    options: [
      { id: 'opt_a', value: 3 },
      { id: 'opt_b', value: 4 },
      { id: 'opt_c', value: 5 },
      { id: 'opt_d', value: 6 },
    ],
    correctOptionId: 'opt_b', // 1 + 1 + 2 = 4
    explanation: '1 + 1 + 2 = 4',
    createdAt: '2026-09-19T00:00:00Z',
  },
  {
    id: 'q009',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [{ value: 2 }, { value: 2 }, { value: 1 }],
    options: [
      { id: 'opt_a', value: 4 },
      { id: 'opt_b', value: 5 },
      { id: 'opt_c', value: 6 },
      { id: 'opt_d', value: 7 },
    ],
    correctOptionId: 'opt_b', // 2 + 2 + 1 = 5
    explanation: '2 + 2 + 1 = 5',
    createdAt: '2026-09-19T00:00:00Z',
  },
  {
    id: 'q010',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [{ value: 3 }, { value: 2 }],
    options: [
      { id: 'opt_a', value: 4 },
      { id: 'opt_b', value: 5 },
      { id: 'opt_c', value: 6 },
      { id: 'opt_d', value: 7 },
    ],
    correctOptionId: 'opt_b', // 3 + 2 = 5
    explanation: '3 + 2 = 5',
    createdAt: '2026-09-19T00:00:00Z',
  },
  {
    id: 'q011',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [{ value: 1 }, { value: 2 }, { value: 2 }],
    options: [
      { id: 'opt_a', value: 4 },
      { id: 'opt_b', value: 5 },
      { id: 'opt_c', value: 6 },
      { id: 'opt_d', value: 7 },
    ],
    correctOptionId: 'opt_b', // 1 + 2 + 2 = 5
    explanation: '1 + 2 + 2 = 5',
    createdAt: '2026-09-19T00:00:00Z',
  },
  {
    id: 'q012',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [{ value: 4 }, { value: 1 }],
    options: [
      { id: 'opt_a', value: 4 },
      { id: 'opt_b', value: 5 },
      { id: 'opt_c', value: 6 },
      { id: 'opt_d', value: 7 },
    ],
    correctOptionId: 'opt_b', // 4 + 1 = 5
    explanation: '4 + 1 = 5',
    createdAt: '2026-09-19T00:00:00Z',
  },
  {
    id: 'q013',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [{ value: 2 }, { value: 3 }, { value: 1 }],
    options: [
      { id: 'opt_a', value: 5 },
      { id: 'opt_b', value: 6 },
      { id: 'opt_c', value: 7 },
      { id: 'opt_d', value: 8 },
    ],
    correctOptionId: 'opt_b', // 2 + 3 + 1 = 6
    explanation: '2 + 3 + 1 = 6',
    createdAt: '2026-09-19T00:00:00Z',
  },
  {
    id: 'q014',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [{ value: 3 }, { value: 3 }],
    options: [
      { id: 'opt_a', value: 5 },
      { id: 'opt_b', value: 6 },
      { id: 'opt_c', value: 7 },
      { id: 'opt_d', value: 8 },
    ],
    correctOptionId: 'opt_b', // 3 + 3 = 6
    explanation: '3 + 3 = 6',
    createdAt: '2026-09-19T00:00:00Z',
  },

  // HARD (6+ questions)
  {
    id: 'q015',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'HARD',
    rows: [{ value: 4 }, { value: 3 }],
    options: [
      { id: 'opt_a', value: 6 },
      { id: 'opt_b', value: 7 },
      { id: 'opt_c', value: 8 },
      { id: 'opt_d', value: 9 },
    ],
    correctOptionId: 'opt_b', // 4 + 3 = 7
    explanation: '4 + 3 = 7',
    createdAt: '2026-09-19T00:00:00Z',
  },
  {
    id: 'q016',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'HARD',
    rows: [{ value: 5 }, { value: 2 }],
    options: [
      { id: 'opt_a', value: 6 },
      { id: 'opt_b', value: 7 },
      { id: 'opt_c', value: 8 },
      { id: 'opt_d', value: 9 },
    ],
    correctOptionId: 'opt_b', // 5 + 2 = 7
    explanation: '5 + 2 = 7',
    createdAt: '2026-09-19T00:00:00Z',
  },
  {
    id: 'q017',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'HARD',
    rows: [{ value: 5 }, { value: 4 }],
    options: [
      { id: 'opt_a', value: 7 },
      { id: 'opt_b', value: 8 },
      { id: 'opt_c', value: 9 },
      { id: 'opt_d', value: 10 },
    ],
    correctOptionId: 'opt_c', // 5 + 4 = 9
    explanation: '5 + 4 = 9',
    createdAt: '2026-09-19T00:00:00Z',
  },
  {
    id: 'q018',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'HARD',
    rows: [{ value: 2 }, { value: 3 }, { value: 4 }],
    options: [
      { id: 'opt_a', value: 7 },
      { id: 'opt_b', value: 8 },
      { id: 'opt_c', value: 9 },
      { id: 'opt_d', value: 10 },
    ],
    correctOptionId: 'opt_c', // 2 + 3 + 4 = 9
    explanation: '2 + 3 + 4 = 9',
    createdAt: '2026-09-19T00:00:00Z',
  },
  {
    id: 'q019',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'HARD',
    rows: [{ value: 3 }, { value: 3 }, { value: 3 }],
    options: [
      { id: 'opt_a', value: 7 },
      { id: 'opt_b', value: 8 },
      { id: 'opt_c', value: 9 },
      { id: 'opt_d', value: 10 },
    ],
    correctOptionId: 'opt_c', // 3 + 3 + 3 = 9
    explanation: '3 + 3 + 3 = 9',
    createdAt: '2026-09-19T00:00:00Z',
  },
  {
    id: 'q020',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'HARD',
    rows: [{ value: 4 }, { value: 4 }],
    options: [
      { id: 'opt_a', value: 7 },
      { id: 'opt_b', value: 8 },
      { id: 'opt_c', value: 9 },
      { id: 'opt_d', value: 10 },
    ],
    correctOptionId: 'opt_b', // 4 + 4 = 8
    explanation: '4 + 4 = 8',
    createdAt: '2026-09-19T00:00:00Z',
  },
  {
    id: 'q021',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'HARD',
    rows: [{ value: 1 }, { value: 4 }, { value: 4 }],
    options: [
      { id: 'opt_a', value: 8 },
      { id: 'opt_b', value: 9 },
      { id: 'opt_c', value: 10 },
      { id: 'opt_d', value: 11 },
    ],
    correctOptionId: 'opt_b', // 1 + 4 + 4 = 9
    explanation: '1 + 4 + 4 = 9',
    createdAt: '2026-09-19T00:00:00Z',
  },
];
