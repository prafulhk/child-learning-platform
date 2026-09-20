import { Question } from '../core/models/question.model';

/**
 * 100 questions extracted from the Small Friend Abacus practice PDF.
 * The PDF does not define application difficulty levels, so these are marked MEDIUM.
 * Addition is represented by an omitted operator; subtraction uses operator: '-'.
 */
export const QUESTIONS_SEED: Question[] = [
  {
    id: 'q001',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 8,
      },
      {
        value: 2,
        operator: '-',
      },
      {
        value: 4,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q001-opt-1',
        value: 3,
      },
      {
        id: 'q001-opt-2',
        value: 1,
      },
      {
        id: 'q001-opt-3',
        value: 4,
      },
      {
        id: 'q001-opt-4',
        value: 2,
      },
    ],
    correctOptionId: 'q001-opt-4',
    explanation: '8 - 2 - 4 = 2',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q002',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 7,
      },
      {
        value: 4,
        operator: '-',
      },
      {
        value: 4,
      },
    ],
    options: [
      {
        id: 'q002-opt-1',
        value: 8,
      },
      {
        id: 'q002-opt-2',
        value: 6,
      },
      {
        id: 'q002-opt-3',
        value: 7,
      },
      {
        id: 'q002-opt-4',
        value: 9,
      },
    ],
    correctOptionId: 'q002-opt-3',
    explanation: '7 - 4 + 4 = 7',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q003',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 8,
      },
      {
        value: 4,
        operator: '-',
      },
      {
        value: 4,
      },
    ],
    options: [
      {
        id: 'q003-opt-1',
        value: 8,
      },
      {
        id: 'q003-opt-2',
        value: 9,
      },
      {
        id: 'q003-opt-3',
        value: 7,
      },
      {
        id: 'q003-opt-4',
        value: 6,
      },
    ],
    correctOptionId: 'q003-opt-1',
    explanation: '8 - 4 + 4 = 8',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q004',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 3,
      },
      {
        value: 4,
      },
      {
        value: 1,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q004-opt-1',
        value: 7,
      },
      {
        id: 'q004-opt-2',
        value: 5,
      },
      {
        id: 'q004-opt-3',
        value: 6,
      },
      {
        id: 'q004-opt-4',
        value: 8,
      },
    ],
    correctOptionId: 'q004-opt-3',
    explanation: '3 + 4 - 1 = 6',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q005',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 4,
      },
      {
        value: 2,
      },
      {
        value: 2,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q005-opt-1',
        value: 4,
      },
      {
        id: 'q005-opt-2',
        value: 3,
      },
      {
        id: 'q005-opt-3',
        value: 5,
      },
      {
        id: 'q005-opt-4',
        value: 6,
      },
    ],
    correctOptionId: 'q005-opt-1',
    explanation: '4 + 2 - 2 = 4',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q006',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 8,
      },
      {
        value: 1,
        operator: '-',
      },
      {
        value: 1,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q006-opt-1',
        value: 7,
      },
      {
        id: 'q006-opt-2',
        value: 8,
      },
      {
        id: 'q006-opt-3',
        value: 6,
      },
      {
        id: 'q006-opt-4',
        value: 5,
      },
    ],
    correctOptionId: 'q006-opt-3',
    explanation: '8 - 1 - 1 = 6',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q007',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 3,
      },
      {
        value: 4,
      },
      {
        value: 1,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q007-opt-1',
        value: 7,
      },
      {
        id: 'q007-opt-2',
        value: 8,
      },
      {
        id: 'q007-opt-3',
        value: 5,
      },
      {
        id: 'q007-opt-4',
        value: 6,
      },
    ],
    correctOptionId: 'q007-opt-4',
    explanation: '3 + 4 - 1 = 6',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q008',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 4,
      },
      {
        value: 4,
      },
      {
        value: 4,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q008-opt-1',
        value: 3,
      },
      {
        id: 'q008-opt-2',
        value: 4,
      },
      {
        id: 'q008-opt-3',
        value: 5,
      },
      {
        id: 'q008-opt-4',
        value: 6,
      },
    ],
    correctOptionId: 'q008-opt-2',
    explanation: '4 + 4 - 4 = 4',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q009',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 7,
      },
      {
        value: 4,
        operator: '-',
      },
      {
        value: 4,
      },
    ],
    options: [
      {
        id: 'q009-opt-1',
        value: 6,
      },
      {
        id: 'q009-opt-2',
        value: 9,
      },
      {
        id: 'q009-opt-3',
        value: 7,
      },
      {
        id: 'q009-opt-4',
        value: 8,
      },
    ],
    correctOptionId: 'q009-opt-3',
    explanation: '7 - 4 + 4 = 7',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q010',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 4,
      },
      {
        value: 2,
      },
      {
        value: 2,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q010-opt-1',
        value: 6,
      },
      {
        id: 'q010-opt-2',
        value: 4,
      },
      {
        id: 'q010-opt-3',
        value: 3,
      },
      {
        id: 'q010-opt-4',
        value: 5,
      },
    ],
    correctOptionId: 'q010-opt-2',
    explanation: '4 + 2 - 2 = 4',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q011',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 9,
      },
      {
        value: 2,
        operator: '-',
      },
      {
        value: 1,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q011-opt-1',
        value: 8,
      },
      {
        id: 'q011-opt-2',
        value: 6,
      },
      {
        id: 'q011-opt-3',
        value: 7,
      },
      {
        id: 'q011-opt-4',
        value: 5,
      },
    ],
    correctOptionId: 'q011-opt-2',
    explanation: '9 - 2 - 1 = 6',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q012',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 7,
      },
      {
        value: 1,
        operator: '-',
      },
      {
        value: 1,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q012-opt-1',
        value: 6,
      },
      {
        id: 'q012-opt-2',
        value: 7,
      },
      {
        id: 'q012-opt-3',
        value: 5,
      },
      {
        id: 'q012-opt-4',
        value: 4,
      },
    ],
    correctOptionId: 'q012-opt-3',
    explanation: '7 - 1 - 1 = 5',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q013',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 5,
      },
      {
        value: 1,
        operator: '-',
      },
      {
        value: 2,
      },
    ],
    options: [
      {
        id: 'q013-opt-1',
        value: 5,
      },
      {
        id: 'q013-opt-2',
        value: 6,
      },
      {
        id: 'q013-opt-3',
        value: 7,
      },
      {
        id: 'q013-opt-4',
        value: 8,
      },
    ],
    correctOptionId: 'q013-opt-2',
    explanation: '5 - 1 + 2 = 6',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q014',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 7,
      },
      {
        value: 3,
        operator: '-',
      },
      {
        value: 4,
      },
    ],
    options: [
      {
        id: 'q014-opt-1',
        value: 7,
      },
      {
        id: 'q014-opt-2',
        value: 9,
      },
      {
        id: 'q014-opt-3',
        value: 6,
      },
      {
        id: 'q014-opt-4',
        value: 8,
      },
    ],
    correctOptionId: 'q014-opt-4',
    explanation: '7 - 3 + 4 = 8',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q015',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 3,
      },
      {
        value: 3,
      },
      {
        value: 3,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q015-opt-1',
        value: 5,
      },
      {
        id: 'q015-opt-2',
        value: 2,
      },
      {
        id: 'q015-opt-3',
        value: 4,
      },
      {
        id: 'q015-opt-4',
        value: 3,
      },
    ],
    correctOptionId: 'q015-opt-4',
    explanation: '3 + 3 - 3 = 3',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q016',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 2,
      },
      {
        value: 4,
      },
      {
        value: 1,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q016-opt-1',
        value: 5,
      },
      {
        id: 'q016-opt-2',
        value: 6,
      },
      {
        id: 'q016-opt-3',
        value: 7,
      },
      {
        id: 'q016-opt-4',
        value: 4,
      },
    ],
    correctOptionId: 'q016-opt-1',
    explanation: '2 + 4 - 1 = 5',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q017',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 6,
      },
      {
        value: 2,
        operator: '-',
      },
      {
        value: 4,
      },
    ],
    options: [
      {
        id: 'q017-opt-1',
        value: 8,
      },
      {
        id: 'q017-opt-2',
        value: 9,
      },
      {
        id: 'q017-opt-3',
        value: 7,
      },
      {
        id: 'q017-opt-4',
        value: 6,
      },
    ],
    correctOptionId: 'q017-opt-1',
    explanation: '6 - 2 + 4 = 8',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q018',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 2,
      },
      {
        value: 4,
      },
      {
        value: 4,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q018-opt-1',
        value: 2,
      },
      {
        id: 'q018-opt-2',
        value: 3,
      },
      {
        id: 'q018-opt-3',
        value: 1,
      },
      {
        id: 'q018-opt-4',
        value: 4,
      },
    ],
    correctOptionId: 'q018-opt-1',
    explanation: '2 + 4 - 4 = 2',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q019',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 9,
      },
      {
        value: 2,
        operator: '-',
      },
      {
        value: 4,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q019-opt-1',
        value: 2,
      },
      {
        id: 'q019-opt-2',
        value: 5,
      },
      {
        id: 'q019-opt-3',
        value: 4,
      },
      {
        id: 'q019-opt-4',
        value: 3,
      },
    ],
    correctOptionId: 'q019-opt-4',
    explanation: '9 - 2 - 4 = 3',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q020',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 3,
      },
      {
        value: 4,
      },
      {
        value: 3,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q020-opt-1',
        value: 3,
      },
      {
        id: 'q020-opt-2',
        value: 5,
      },
      {
        id: 'q020-opt-3',
        value: 6,
      },
      {
        id: 'q020-opt-4',
        value: 4,
      },
    ],
    correctOptionId: 'q020-opt-4',
    explanation: '3 + 4 - 3 = 4',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q021',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 8,
      },
      {
        value: 1,
        operator: '-',
      },
      {
        value: 1,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q021-opt-1',
        value: 8,
      },
      {
        id: 'q021-opt-2',
        value: 6,
      },
      {
        id: 'q021-opt-3',
        value: 5,
      },
      {
        id: 'q021-opt-4',
        value: 7,
      },
    ],
    correctOptionId: 'q021-opt-2',
    explanation: '8 - 1 - 1 = 6',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q022',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 3,
      },
      {
        value: 4,
      },
      {
        value: 3,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q022-opt-1',
        value: 4,
      },
      {
        id: 'q022-opt-2',
        value: 3,
      },
      {
        id: 'q022-opt-3',
        value: 6,
      },
      {
        id: 'q022-opt-4',
        value: 5,
      },
    ],
    correctOptionId: 'q022-opt-1',
    explanation: '3 + 4 - 3 = 4',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q023',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 9,
      },
      {
        value: 4,
        operator: '-',
      },
      {
        value: 3,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q023-opt-1',
        value: 2,
      },
      {
        id: 'q023-opt-2',
        value: 3,
      },
      {
        id: 'q023-opt-3',
        value: 1,
      },
      {
        id: 'q023-opt-4',
        value: 4,
      },
    ],
    correctOptionId: 'q023-opt-1',
    explanation: '9 - 4 - 3 = 2',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q024',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 4,
      },
      {
        value: 3,
      },
      {
        value: 3,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q024-opt-1',
        value: 6,
      },
      {
        id: 'q024-opt-2',
        value: 3,
      },
      {
        id: 'q024-opt-3',
        value: 5,
      },
      {
        id: 'q024-opt-4',
        value: 4,
      },
    ],
    correctOptionId: 'q024-opt-4',
    explanation: '4 + 3 - 3 = 4',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q025',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 4,
      },
      {
        value: 2,
      },
      {
        value: 3,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q025-opt-1',
        value: 5,
      },
      {
        id: 'q025-opt-2',
        value: 2,
      },
      {
        id: 'q025-opt-3',
        value: 3,
      },
      {
        id: 'q025-opt-4',
        value: 4,
      },
    ],
    correctOptionId: 'q025-opt-3',
    explanation: '4 + 2 - 3 = 3',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q026',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 7,
      },
      {
        value: 3,
        operator: '-',
      },
      {
        value: 2,
      },
    ],
    options: [
      {
        id: 'q026-opt-1',
        value: 8,
      },
      {
        id: 'q026-opt-2',
        value: 5,
      },
      {
        id: 'q026-opt-3',
        value: 7,
      },
      {
        id: 'q026-opt-4',
        value: 6,
      },
    ],
    correctOptionId: 'q026-opt-4',
    explanation: '7 - 3 + 2 = 6',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q027',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 3,
      },
      {
        value: 3,
      },
      {
        value: 4,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q027-opt-1',
        value: 3,
      },
      {
        id: 'q027-opt-2',
        value: 1,
      },
      {
        id: 'q027-opt-3',
        value: 4,
      },
      {
        id: 'q027-opt-4',
        value: 2,
      },
    ],
    correctOptionId: 'q027-opt-4',
    explanation: '3 + 3 - 4 = 2',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q028',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 8,
      },
      {
        value: 4,
        operator: '-',
      },
      {
        value: 2,
      },
    ],
    options: [
      {
        id: 'q028-opt-1',
        value: 6,
      },
      {
        id: 'q028-opt-2',
        value: 7,
      },
      {
        id: 'q028-opt-3',
        value: 5,
      },
      {
        id: 'q028-opt-4',
        value: 8,
      },
    ],
    correctOptionId: 'q028-opt-1',
    explanation: '8 - 4 + 2 = 6',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q029',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 2,
      },
      {
        value: 4,
      },
      {
        value: 3,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q029-opt-1',
        value: 4,
      },
      {
        id: 'q029-opt-2',
        value: 3,
      },
      {
        id: 'q029-opt-3',
        value: 5,
      },
      {
        id: 'q029-opt-4',
        value: 2,
      },
    ],
    correctOptionId: 'q029-opt-2',
    explanation: '2 + 4 - 3 = 3',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q030',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 9,
      },
      {
        value: 1,
        operator: '-',
      },
      {
        value: 1,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q030-opt-1',
        value: 6,
      },
      {
        id: 'q030-opt-2',
        value: 9,
      },
      {
        id: 'q030-opt-3',
        value: 8,
      },
      {
        id: 'q030-opt-4',
        value: 7,
      },
    ],
    correctOptionId: 'q030-opt-4',
    explanation: '9 - 1 - 1 = 7',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q031',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 9,
      },
      {
        value: 4,
        operator: '-',
      },
      {
        value: 3,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q031-opt-1',
        value: 1,
      },
      {
        id: 'q031-opt-2',
        value: 3,
      },
      {
        id: 'q031-opt-3',
        value: 4,
      },
      {
        id: 'q031-opt-4',
        value: 2,
      },
    ],
    correctOptionId: 'q031-opt-4',
    explanation: '9 - 4 - 3 = 2',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q032',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 2,
      },
      {
        value: 4,
      },
      {
        value: 3,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q032-opt-1',
        value: 3,
      },
      {
        id: 'q032-opt-2',
        value: 4,
      },
      {
        id: 'q032-opt-3',
        value: 2,
      },
      {
        id: 'q032-opt-4',
        value: 5,
      },
    ],
    correctOptionId: 'q032-opt-1',
    explanation: '2 + 4 - 3 = 3',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q033',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 8,
      },
      {
        value: 1,
        operator: '-',
      },
      {
        value: 1,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q033-opt-1',
        value: 6,
      },
      {
        id: 'q033-opt-2',
        value: 8,
      },
      {
        id: 'q033-opt-3',
        value: 5,
      },
      {
        id: 'q033-opt-4',
        value: 7,
      },
    ],
    correctOptionId: 'q033-opt-1',
    explanation: '8 - 1 - 1 = 6',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q034',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 6,
      },
      {
        value: 1,
        operator: '-',
      },
      {
        value: 4,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q034-opt-1',
        value: 2,
      },
      {
        id: 'q034-opt-2',
        value: 3,
      },
      {
        id: 'q034-opt-3',
        value: 0,
      },
      {
        id: 'q034-opt-4',
        value: 1,
      },
    ],
    correctOptionId: 'q034-opt-4',
    explanation: '6 - 1 - 4 = 1',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q035',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 4,
      },
      {
        value: 3,
      },
      {
        value: 3,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q035-opt-1',
        value: 3,
      },
      {
        id: 'q035-opt-2',
        value: 5,
      },
      {
        id: 'q035-opt-3',
        value: 4,
      },
      {
        id: 'q035-opt-4',
        value: 6,
      },
    ],
    correctOptionId: 'q035-opt-3',
    explanation: '4 + 3 - 3 = 4',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q036',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 8,
      },
      {
        value: 1,
        operator: '-',
      },
      {
        value: 4,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q036-opt-1',
        value: 4,
      },
      {
        id: 'q036-opt-2',
        value: 3,
      },
      {
        id: 'q036-opt-3',
        value: 2,
      },
      {
        id: 'q036-opt-4',
        value: 5,
      },
    ],
    correctOptionId: 'q036-opt-2',
    explanation: '8 - 1 - 4 = 3',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q037',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 2,
      },
      {
        value: 4,
      },
      {
        value: 4,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q037-opt-1',
        value: 4,
      },
      {
        id: 'q037-opt-2',
        value: 1,
      },
      {
        id: 'q037-opt-3',
        value: 3,
      },
      {
        id: 'q037-opt-4',
        value: 2,
      },
    ],
    correctOptionId: 'q037-opt-4',
    explanation: '2 + 4 - 4 = 2',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q038',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 3,
      },
      {
        value: 3,
      },
      {
        value: 3,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q038-opt-1',
        value: 2,
      },
      {
        id: 'q038-opt-2',
        value: 4,
      },
      {
        id: 'q038-opt-3',
        value: 5,
      },
      {
        id: 'q038-opt-4',
        value: 3,
      },
    ],
    correctOptionId: 'q038-opt-4',
    explanation: '3 + 3 - 3 = 3',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q039',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 8,
      },
      {
        value: 4,
        operator: '-',
      },
      {
        value: 2,
      },
    ],
    options: [
      {
        id: 'q039-opt-1',
        value: 8,
      },
      {
        id: 'q039-opt-2',
        value: 5,
      },
      {
        id: 'q039-opt-3',
        value: 6,
      },
      {
        id: 'q039-opt-4',
        value: 7,
      },
    ],
    correctOptionId: 'q039-opt-3',
    explanation: '8 - 4 + 2 = 6',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q040',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 3,
      },
      {
        value: 4,
      },
      {
        value: 1,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q040-opt-1',
        value: 7,
      },
      {
        id: 'q040-opt-2',
        value: 8,
      },
      {
        id: 'q040-opt-3',
        value: 6,
      },
      {
        id: 'q040-opt-4',
        value: 5,
      },
    ],
    correctOptionId: 'q040-opt-3',
    explanation: '3 + 4 - 1 = 6',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q041',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 3,
      },
      {
        value: 4,
      },
      {
        value: 4,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q041-opt-1',
        value: 2,
      },
      {
        id: 'q041-opt-2',
        value: 4,
      },
      {
        id: 'q041-opt-3',
        value: 3,
      },
      {
        id: 'q041-opt-4',
        value: 5,
      },
    ],
    correctOptionId: 'q041-opt-3',
    explanation: '3 + 4 - 4 = 3',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q042',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 4,
      },
      {
        value: 2,
      },
      {
        value: 3,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q042-opt-1',
        value: 2,
      },
      {
        id: 'q042-opt-2',
        value: 5,
      },
      {
        id: 'q042-opt-3',
        value: 3,
      },
      {
        id: 'q042-opt-4',
        value: 4,
      },
    ],
    correctOptionId: 'q042-opt-3',
    explanation: '4 + 2 - 3 = 3',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q043',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 6,
      },
      {
        value: 2,
        operator: '-',
      },
      {
        value: 3,
      },
    ],
    options: [
      {
        id: 'q043-opt-1',
        value: 7,
      },
      {
        id: 'q043-opt-2',
        value: 9,
      },
      {
        id: 'q043-opt-3',
        value: 8,
      },
      {
        id: 'q043-opt-4',
        value: 6,
      },
    ],
    correctOptionId: 'q043-opt-1',
    explanation: '6 - 2 + 3 = 7',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q044',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 2,
      },
      {
        value: 4,
      },
      {
        value: 2,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q044-opt-1',
        value: 4,
      },
      {
        id: 'q044-opt-2',
        value: 3,
      },
      {
        id: 'q044-opt-3',
        value: 6,
      },
      {
        id: 'q044-opt-4',
        value: 5,
      },
    ],
    correctOptionId: 'q044-opt-1',
    explanation: '2 + 4 - 2 = 4',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q045',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 8,
      },
      {
        value: 4,
        operator: '-',
      },
      {
        value: 4,
      },
    ],
    options: [
      {
        id: 'q045-opt-1',
        value: 6,
      },
      {
        id: 'q045-opt-2',
        value: 9,
      },
      {
        id: 'q045-opt-3',
        value: 7,
      },
      {
        id: 'q045-opt-4',
        value: 8,
      },
    ],
    correctOptionId: 'q045-opt-4',
    explanation: '8 - 4 + 4 = 8',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q046',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 9,
      },
      {
        value: 2,
        operator: '-',
      },
      {
        value: 1,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q046-opt-1',
        value: 6,
      },
      {
        id: 'q046-opt-2',
        value: 7,
      },
      {
        id: 'q046-opt-3',
        value: 5,
      },
      {
        id: 'q046-opt-4',
        value: 8,
      },
    ],
    correctOptionId: 'q046-opt-1',
    explanation: '9 - 2 - 1 = 6',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q047',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 2,
      },
      {
        value: 4,
      },
      {
        value: 2,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q047-opt-1',
        value: 6,
      },
      {
        id: 'q047-opt-2',
        value: 3,
      },
      {
        id: 'q047-opt-3',
        value: 5,
      },
      {
        id: 'q047-opt-4',
        value: 4,
      },
    ],
    correctOptionId: 'q047-opt-4',
    explanation: '2 + 4 - 2 = 4',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q048',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 7,
      },
      {
        value: 4,
        operator: '-',
      },
      {
        value: 3,
      },
    ],
    options: [
      {
        id: 'q048-opt-1',
        value: 8,
      },
      {
        id: 'q048-opt-2',
        value: 6,
      },
      {
        id: 'q048-opt-3',
        value: 7,
      },
      {
        id: 'q048-opt-4',
        value: 5,
      },
    ],
    correctOptionId: 'q048-opt-2',
    explanation: '7 - 4 + 3 = 6',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q049',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 6,
      },
      {
        value: 1,
        operator: '-',
      },
      {
        value: 1,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q049-opt-1',
        value: 5,
      },
      {
        id: 'q049-opt-2',
        value: 3,
      },
      {
        id: 'q049-opt-3',
        value: 4,
      },
      {
        id: 'q049-opt-4',
        value: 6,
      },
    ],
    correctOptionId: 'q049-opt-3',
    explanation: '6 - 1 - 1 = 4',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q050',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 9,
      },
      {
        value: 4,
        operator: '-',
      },
      {
        value: 2,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q050-opt-1',
        value: 3,
      },
      {
        id: 'q050-opt-2',
        value: 4,
      },
      {
        id: 'q050-opt-3',
        value: 5,
      },
      {
        id: 'q050-opt-4',
        value: 2,
      },
    ],
    correctOptionId: 'q050-opt-1',
    explanation: '9 - 4 - 2 = 3',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q051',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 7,
      },
      {
        value: 4,
        operator: '-',
      },
      {
        value: 4,
      },
    ],
    options: [
      {
        id: 'q051-opt-1',
        value: 8,
      },
      {
        id: 'q051-opt-2',
        value: 9,
      },
      {
        id: 'q051-opt-3',
        value: 6,
      },
      {
        id: 'q051-opt-4',
        value: 7,
      },
    ],
    correctOptionId: 'q051-opt-4',
    explanation: '7 - 4 + 4 = 7',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q052',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 7,
      },
      {
        value: 1,
        operator: '-',
      },
      {
        value: 3,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q052-opt-1',
        value: 5,
      },
      {
        id: 'q052-opt-2',
        value: 3,
      },
      {
        id: 'q052-opt-3',
        value: 2,
      },
      {
        id: 'q052-opt-4',
        value: 4,
      },
    ],
    correctOptionId: 'q052-opt-2',
    explanation: '7 - 1 - 3 = 3',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q053',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 9,
      },
      {
        value: 1,
        operator: '-',
      },
      {
        value: 1,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q053-opt-1',
        value: 7,
      },
      {
        id: 'q053-opt-2',
        value: 9,
      },
      {
        id: 'q053-opt-3',
        value: 8,
      },
      {
        id: 'q053-opt-4',
        value: 6,
      },
    ],
    correctOptionId: 'q053-opt-1',
    explanation: '9 - 1 - 1 = 7',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q054',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 9,
      },
      {
        value: 1,
        operator: '-',
      },
      {
        value: 4,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q054-opt-1',
        value: 5,
      },
      {
        id: 'q054-opt-2',
        value: 6,
      },
      {
        id: 'q054-opt-3',
        value: 3,
      },
      {
        id: 'q054-opt-4',
        value: 4,
      },
    ],
    correctOptionId: 'q054-opt-4',
    explanation: '9 - 1 - 4 = 4',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q055',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 3,
      },
      {
        value: 4,
      },
      {
        value: 3,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q055-opt-1',
        value: 3,
      },
      {
        id: 'q055-opt-2',
        value: 5,
      },
      {
        id: 'q055-opt-3',
        value: 6,
      },
      {
        id: 'q055-opt-4',
        value: 4,
      },
    ],
    correctOptionId: 'q055-opt-4',
    explanation: '3 + 4 - 3 = 4',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q056',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 9,
      },
      {
        value: 2,
        operator: '-',
      },
      {
        value: 3,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q056-opt-1',
        value: 3,
      },
      {
        id: 'q056-opt-2',
        value: 5,
      },
      {
        id: 'q056-opt-3',
        value: 6,
      },
      {
        id: 'q056-opt-4',
        value: 4,
      },
    ],
    correctOptionId: 'q056-opt-4',
    explanation: '9 - 2 - 3 = 4',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q057',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 6,
      },
      {
        value: 4,
        operator: '-',
      },
      {
        value: 4,
      },
    ],
    options: [
      {
        id: 'q057-opt-1',
        value: 6,
      },
      {
        id: 'q057-opt-2',
        value: 5,
      },
      {
        id: 'q057-opt-3',
        value: 8,
      },
      {
        id: 'q057-opt-4',
        value: 7,
      },
    ],
    correctOptionId: 'q057-opt-1',
    explanation: '6 - 4 + 4 = 6',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q058',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 7,
      },
      {
        value: 3,
        operator: '-',
      },
      {
        value: 3,
      },
    ],
    options: [
      {
        id: 'q058-opt-1',
        value: 8,
      },
      {
        id: 'q058-opt-2',
        value: 7,
      },
      {
        id: 'q058-opt-3',
        value: 9,
      },
      {
        id: 'q058-opt-4',
        value: 6,
      },
    ],
    correctOptionId: 'q058-opt-2',
    explanation: '7 - 3 + 3 = 7',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q059',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 3,
      },
      {
        value: 4,
      },
      {
        value: 2,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q059-opt-1',
        value: 6,
      },
      {
        id: 'q059-opt-2',
        value: 4,
      },
      {
        id: 'q059-opt-3',
        value: 7,
      },
      {
        id: 'q059-opt-4',
        value: 5,
      },
    ],
    correctOptionId: 'q059-opt-4',
    explanation: '3 + 4 - 2 = 5',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q060',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 2,
      },
      {
        value: 4,
      },
      {
        value: 3,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q060-opt-1',
        value: 5,
      },
      {
        id: 'q060-opt-2',
        value: 2,
      },
      {
        id: 'q060-opt-3',
        value: 3,
      },
      {
        id: 'q060-opt-4',
        value: 4,
      },
    ],
    correctOptionId: 'q060-opt-3',
    explanation: '2 + 4 - 3 = 3',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q061',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 2,
      },
      {
        value: 4,
      },
      {
        value: 1,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q061-opt-1',
        value: 7,
      },
      {
        id: 'q061-opt-2',
        value: 5,
      },
      {
        id: 'q061-opt-3',
        value: 6,
      },
      {
        id: 'q061-opt-4',
        value: 4,
      },
    ],
    correctOptionId: 'q061-opt-2',
    explanation: '2 + 4 - 1 = 5',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q062',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 4,
      },
      {
        value: 4,
      },
      {
        value: 1,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q062-opt-1',
        value: 6,
      },
      {
        id: 'q062-opt-2',
        value: 8,
      },
      {
        id: 'q062-opt-3',
        value: 9,
      },
      {
        id: 'q062-opt-4',
        value: 7,
      },
    ],
    correctOptionId: 'q062-opt-4',
    explanation: '4 + 4 - 1 = 7',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q063',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 4,
      },
      {
        value: 2,
      },
      {
        value: 4,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q063-opt-1',
        value: 1,
      },
      {
        id: 'q063-opt-2',
        value: 4,
      },
      {
        id: 'q063-opt-3',
        value: 2,
      },
      {
        id: 'q063-opt-4',
        value: 3,
      },
    ],
    correctOptionId: 'q063-opt-3',
    explanation: '4 + 2 - 4 = 2',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q064',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 5,
      },
      {
        value: 1,
        operator: '-',
      },
      {
        value: 4,
      },
    ],
    options: [
      {
        id: 'q064-opt-1',
        value: 6,
      },
      {
        id: 'q064-opt-2',
        value: 8,
      },
      {
        id: 'q064-opt-3',
        value: 7,
      },
      {
        id: 'q064-opt-4',
        value: 9,
      },
    ],
    correctOptionId: 'q064-opt-2',
    explanation: '5 - 1 + 4 = 8',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q065',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 6,
      },
      {
        value: 3,
        operator: '-',
      },
      {
        value: 4,
      },
    ],
    options: [
      {
        id: 'q065-opt-1',
        value: 6,
      },
      {
        id: 'q065-opt-2',
        value: 9,
      },
      {
        id: 'q065-opt-3',
        value: 8,
      },
      {
        id: 'q065-opt-4',
        value: 7,
      },
    ],
    correctOptionId: 'q065-opt-4',
    explanation: '6 - 3 + 4 = 7',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q066',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 4,
      },
      {
        value: 4,
      },
      {
        value: 3,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q066-opt-1',
        value: 5,
      },
      {
        id: 'q066-opt-2',
        value: 6,
      },
      {
        id: 'q066-opt-3',
        value: 4,
      },
      {
        id: 'q066-opt-4',
        value: 7,
      },
    ],
    correctOptionId: 'q066-opt-1',
    explanation: '4 + 4 - 3 = 5',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q067',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 3,
      },
      {
        value: 4,
      },
      {
        value: 1,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q067-opt-1',
        value: 8,
      },
      {
        id: 'q067-opt-2',
        value: 5,
      },
      {
        id: 'q067-opt-3',
        value: 7,
      },
      {
        id: 'q067-opt-4',
        value: 6,
      },
    ],
    correctOptionId: 'q067-opt-4',
    explanation: '3 + 4 - 1 = 6',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q068',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 4,
      },
      {
        value: 3,
      },
      {
        value: 1,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q068-opt-1',
        value: 5,
      },
      {
        id: 'q068-opt-2',
        value: 6,
      },
      {
        id: 'q068-opt-3',
        value: 7,
      },
      {
        id: 'q068-opt-4',
        value: 8,
      },
    ],
    correctOptionId: 'q068-opt-2',
    explanation: '4 + 3 - 1 = 6',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q069',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 4,
      },
      {
        value: 3,
      },
      {
        value: 4,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q069-opt-1',
        value: 4,
      },
      {
        id: 'q069-opt-2',
        value: 3,
      },
      {
        id: 'q069-opt-3',
        value: 5,
      },
      {
        id: 'q069-opt-4',
        value: 2,
      },
    ],
    correctOptionId: 'q069-opt-2',
    explanation: '4 + 3 - 4 = 3',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q070',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 5,
      },
      {
        value: 2,
        operator: '-',
      },
      {
        value: 3,
      },
    ],
    options: [
      {
        id: 'q070-opt-1',
        value: 7,
      },
      {
        id: 'q070-opt-2',
        value: 6,
      },
      {
        id: 'q070-opt-3',
        value: 8,
      },
      {
        id: 'q070-opt-4',
        value: 5,
      },
    ],
    correctOptionId: 'q070-opt-2',
    explanation: '5 - 2 + 3 = 6',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q071',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 6,
      },
      {
        value: 2,
        operator: '-',
      },
      {
        value: 2,
      },
    ],
    options: [
      {
        id: 'q071-opt-1',
        value: 8,
      },
      {
        id: 'q071-opt-2',
        value: 5,
      },
      {
        id: 'q071-opt-3',
        value: 7,
      },
      {
        id: 'q071-opt-4',
        value: 6,
      },
    ],
    correctOptionId: 'q071-opt-4',
    explanation: '6 - 2 + 2 = 6',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q072',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 8,
      },
      {
        value: 1,
        operator: '-',
      },
      {
        value: 2,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q072-opt-1',
        value: 4,
      },
      {
        id: 'q072-opt-2',
        value: 5,
      },
      {
        id: 'q072-opt-3',
        value: 6,
      },
      {
        id: 'q072-opt-4',
        value: 7,
      },
    ],
    correctOptionId: 'q072-opt-2',
    explanation: '8 - 1 - 2 = 5',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q073',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 7,
      },
      {
        value: 2,
        operator: '-',
      },
      {
        value: 2,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q073-opt-1',
        value: 4,
      },
      {
        id: 'q073-opt-2',
        value: 3,
      },
      {
        id: 'q073-opt-3',
        value: 5,
      },
      {
        id: 'q073-opt-4',
        value: 2,
      },
    ],
    correctOptionId: 'q073-opt-2',
    explanation: '7 - 2 - 2 = 3',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q074',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 8,
      },
      {
        value: 3,
        operator: '-',
      },
      {
        value: 3,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q074-opt-1',
        value: 1,
      },
      {
        id: 'q074-opt-2',
        value: 2,
      },
      {
        id: 'q074-opt-3',
        value: 3,
      },
      {
        id: 'q074-opt-4',
        value: 4,
      },
    ],
    correctOptionId: 'q074-opt-2',
    explanation: '8 - 3 - 3 = 2',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q075',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 5,
      },
      {
        value: 2,
        operator: '-',
      },
      {
        value: 4,
      },
    ],
    options: [
      {
        id: 'q075-opt-1',
        value: 8,
      },
      {
        id: 'q075-opt-2',
        value: 6,
      },
      {
        id: 'q075-opt-3',
        value: 7,
      },
      {
        id: 'q075-opt-4',
        value: 9,
      },
    ],
    correctOptionId: 'q075-opt-3',
    explanation: '5 - 2 + 4 = 7',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q076',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 9,
      },
      {
        value: 4,
        operator: '-',
      },
      {
        value: 4,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q076-opt-1',
        value: 2,
      },
      {
        id: 'q076-opt-2',
        value: 3,
      },
      {
        id: 'q076-opt-3',
        value: 1,
      },
      {
        id: 'q076-opt-4',
        value: 0,
      },
    ],
    correctOptionId: 'q076-opt-3',
    explanation: '9 - 4 - 4 = 1',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q077',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 3,
      },
      {
        value: 4,
      },
      {
        value: 1,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q077-opt-1',
        value: 5,
      },
      {
        id: 'q077-opt-2',
        value: 7,
      },
      {
        id: 'q077-opt-3',
        value: 8,
      },
      {
        id: 'q077-opt-4',
        value: 6,
      },
    ],
    correctOptionId: 'q077-opt-4',
    explanation: '3 + 4 - 1 = 6',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q078',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 9,
      },
      {
        value: 2,
        operator: '-',
      },
      {
        value: 4,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q078-opt-1',
        value: 2,
      },
      {
        id: 'q078-opt-2',
        value: 4,
      },
      {
        id: 'q078-opt-3',
        value: 5,
      },
      {
        id: 'q078-opt-4',
        value: 3,
      },
    ],
    correctOptionId: 'q078-opt-4',
    explanation: '9 - 2 - 4 = 3',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q079',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 7,
      },
      {
        value: 3,
        operator: '-',
      },
      {
        value: 4,
      },
    ],
    options: [
      {
        id: 'q079-opt-1',
        value: 9,
      },
      {
        id: 'q079-opt-2',
        value: 7,
      },
      {
        id: 'q079-opt-3',
        value: 8,
      },
      {
        id: 'q079-opt-4',
        value: 6,
      },
    ],
    correctOptionId: 'q079-opt-3',
    explanation: '7 - 3 + 4 = 8',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q080',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 2,
      },
      {
        value: 4,
      },
      {
        value: 2,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q080-opt-1',
        value: 4,
      },
      {
        id: 'q080-opt-2',
        value: 5,
      },
      {
        id: 'q080-opt-3',
        value: 3,
      },
      {
        id: 'q080-opt-4',
        value: 6,
      },
    ],
    correctOptionId: 'q080-opt-1',
    explanation: '2 + 4 - 2 = 4',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q081',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 9,
      },
      {
        value: 2,
        operator: '-',
      },
      {
        value: 3,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q081-opt-1',
        value: 3,
      },
      {
        id: 'q081-opt-2',
        value: 4,
      },
      {
        id: 'q081-opt-3',
        value: 5,
      },
      {
        id: 'q081-opt-4',
        value: 6,
      },
    ],
    correctOptionId: 'q081-opt-2',
    explanation: '9 - 2 - 3 = 4',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q082',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 8,
      },
      {
        value: 3,
        operator: '-',
      },
      {
        value: 4,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q082-opt-1',
        value: 3,
      },
      {
        id: 'q082-opt-2',
        value: 1,
      },
      {
        id: 'q082-opt-3',
        value: 0,
      },
      {
        id: 'q082-opt-4',
        value: 2,
      },
    ],
    correctOptionId: 'q082-opt-2',
    explanation: '8 - 3 - 4 = 1',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q083',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 3,
      },
      {
        value: 3,
      },
      {
        value: 4,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q083-opt-1',
        value: 2,
      },
      {
        id: 'q083-opt-2',
        value: 1,
      },
      {
        id: 'q083-opt-3',
        value: 4,
      },
      {
        id: 'q083-opt-4',
        value: 3,
      },
    ],
    correctOptionId: 'q083-opt-1',
    explanation: '3 + 3 - 4 = 2',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q084',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 7,
      },
      {
        value: 1,
        operator: '-',
      },
      {
        value: 4,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q084-opt-1',
        value: 4,
      },
      {
        id: 'q084-opt-2',
        value: 3,
      },
      {
        id: 'q084-opt-3',
        value: 1,
      },
      {
        id: 'q084-opt-4',
        value: 2,
      },
    ],
    correctOptionId: 'q084-opt-4',
    explanation: '7 - 1 - 4 = 2',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q085',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 2,
      },
      {
        value: 4,
      },
      {
        value: 3,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q085-opt-1',
        value: 4,
      },
      {
        id: 'q085-opt-2',
        value: 3,
      },
      {
        id: 'q085-opt-3',
        value: 5,
      },
      {
        id: 'q085-opt-4',
        value: 2,
      },
    ],
    correctOptionId: 'q085-opt-2',
    explanation: '2 + 4 - 3 = 3',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q086',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 7,
      },
      {
        value: 3,
        operator: '-',
      },
      {
        value: 3,
      },
    ],
    options: [
      {
        id: 'q086-opt-1',
        value: 7,
      },
      {
        id: 'q086-opt-2',
        value: 6,
      },
      {
        id: 'q086-opt-3',
        value: 8,
      },
      {
        id: 'q086-opt-4',
        value: 9,
      },
    ],
    correctOptionId: 'q086-opt-1',
    explanation: '7 - 3 + 3 = 7',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q087',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 5,
      },
      {
        value: 2,
        operator: '-',
      },
      {
        value: 3,
      },
    ],
    options: [
      {
        id: 'q087-opt-1',
        value: 5,
      },
      {
        id: 'q087-opt-2',
        value: 8,
      },
      {
        id: 'q087-opt-3',
        value: 6,
      },
      {
        id: 'q087-opt-4',
        value: 7,
      },
    ],
    correctOptionId: 'q087-opt-3',
    explanation: '5 - 2 + 3 = 6',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q088',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 8,
      },
      {
        value: 3,
        operator: '-',
      },
      {
        value: 4,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q088-opt-1',
        value: 1,
      },
      {
        id: 'q088-opt-2',
        value: 0,
      },
      {
        id: 'q088-opt-3',
        value: 2,
      },
      {
        id: 'q088-opt-4',
        value: 3,
      },
    ],
    correctOptionId: 'q088-opt-1',
    explanation: '8 - 3 - 4 = 1',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q089',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 6,
      },
      {
        value: 3,
        operator: '-',
      },
      {
        value: 4,
      },
    ],
    options: [
      {
        id: 'q089-opt-1',
        value: 7,
      },
      {
        id: 'q089-opt-2',
        value: 9,
      },
      {
        id: 'q089-opt-3',
        value: 8,
      },
      {
        id: 'q089-opt-4',
        value: 6,
      },
    ],
    correctOptionId: 'q089-opt-1',
    explanation: '6 - 3 + 4 = 7',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q090',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 8,
      },
      {
        value: 4,
        operator: '-',
      },
      {
        value: 2,
      },
    ],
    options: [
      {
        id: 'q090-opt-1',
        value: 5,
      },
      {
        id: 'q090-opt-2',
        value: 7,
      },
      {
        id: 'q090-opt-3',
        value: 6,
      },
      {
        id: 'q090-opt-4',
        value: 8,
      },
    ],
    correctOptionId: 'q090-opt-3',
    explanation: '8 - 4 + 2 = 6',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q091',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 6,
      },
      {
        value: 4,
        operator: '-',
      },
      {
        value: 4,
      },
    ],
    options: [
      {
        id: 'q091-opt-1',
        value: 8,
      },
      {
        id: 'q091-opt-2',
        value: 7,
      },
      {
        id: 'q091-opt-3',
        value: 6,
      },
      {
        id: 'q091-opt-4',
        value: 5,
      },
    ],
    correctOptionId: 'q091-opt-3',
    explanation: '6 - 4 + 4 = 6',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q092',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 2,
      },
      {
        value: 4,
      },
      {
        value: 1,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q092-opt-1',
        value: 4,
      },
      {
        id: 'q092-opt-2',
        value: 5,
      },
      {
        id: 'q092-opt-3',
        value: 6,
      },
      {
        id: 'q092-opt-4',
        value: 7,
      },
    ],
    correctOptionId: 'q092-opt-2',
    explanation: '2 + 4 - 1 = 5',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q093',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 8,
      },
      {
        value: 4,
        operator: '-',
      },
      {
        value: 4,
      },
    ],
    options: [
      {
        id: 'q093-opt-1',
        value: 8,
      },
      {
        id: 'q093-opt-2',
        value: 9,
      },
      {
        id: 'q093-opt-3',
        value: 6,
      },
      {
        id: 'q093-opt-4',
        value: 7,
      },
    ],
    correctOptionId: 'q093-opt-1',
    explanation: '8 - 4 + 4 = 8',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q094',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 2,
      },
      {
        value: 4,
      },
      {
        value: 2,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q094-opt-1',
        value: 4,
      },
      {
        id: 'q094-opt-2',
        value: 5,
      },
      {
        id: 'q094-opt-3',
        value: 6,
      },
      {
        id: 'q094-opt-4',
        value: 3,
      },
    ],
    correctOptionId: 'q094-opt-1',
    explanation: '2 + 4 - 2 = 4',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q095',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 2,
      },
      {
        value: 4,
      },
      {
        value: 3,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q095-opt-1',
        value: 5,
      },
      {
        id: 'q095-opt-2',
        value: 2,
      },
      {
        id: 'q095-opt-3',
        value: 3,
      },
      {
        id: 'q095-opt-4',
        value: 4,
      },
    ],
    correctOptionId: 'q095-opt-3',
    explanation: '2 + 4 - 3 = 3',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q096',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 7,
      },
      {
        value: 4,
        operator: '-',
      },
      {
        value: 3,
      },
    ],
    options: [
      {
        id: 'q096-opt-1',
        value: 5,
      },
      {
        id: 'q096-opt-2',
        value: 7,
      },
      {
        id: 'q096-opt-3',
        value: 6,
      },
      {
        id: 'q096-opt-4',
        value: 8,
      },
    ],
    correctOptionId: 'q096-opt-3',
    explanation: '7 - 4 + 3 = 6',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q097',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 6,
      },
      {
        value: 1,
        operator: '-',
      },
      {
        value: 4,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q097-opt-1',
        value: 0,
      },
      {
        id: 'q097-opt-2',
        value: 2,
      },
      {
        id: 'q097-opt-3',
        value: 3,
      },
      {
        id: 'q097-opt-4',
        value: 1,
      },
    ],
    correctOptionId: 'q097-opt-4',
    explanation: '6 - 1 - 4 = 1',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q098',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 2,
      },
      {
        value: 4,
      },
      {
        value: 2,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q098-opt-1',
        value: 4,
      },
      {
        id: 'q098-opt-2',
        value: 3,
      },
      {
        id: 'q098-opt-3',
        value: 6,
      },
      {
        id: 'q098-opt-4',
        value: 5,
      },
    ],
    correctOptionId: 'q098-opt-1',
    explanation: '2 + 4 - 2 = 4',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q099',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 6,
      },
      {
        value: 2,
        operator: '-',
      },
      {
        value: 3,
      },
    ],
    options: [
      {
        id: 'q099-opt-1',
        value: 8,
      },
      {
        id: 'q099-opt-2',
        value: 6,
      },
      {
        id: 'q099-opt-3',
        value: 7,
      },
      {
        id: 'q099-opt-4',
        value: 9,
      },
    ],
    correctOptionId: 'q099-opt-3',
    explanation: '6 - 2 + 3 = 7',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
  {
    id: 'q100',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'MEDIUM',
    rows: [
      {
        value: 4,
      },
      {
        value: 4,
      },
      {
        value: 3,
        operator: '-',
      },
    ],
    options: [
      {
        id: 'q100-opt-1',
        value: 6,
      },
      {
        id: 'q100-opt-2',
        value: 7,
      },
      {
        id: 'q100-opt-3',
        value: 4,
      },
      {
        id: 'q100-opt-4',
        value: 5,
      },
    ],
    correctOptionId: 'q100-opt-4',
    explanation: '4 + 4 - 3 = 5',
    source: {
      sourceType: 'PDF',
      originalFileName: 'Small_Friends_Abacus_20_Page_Timed_Practice(4).pdf',
      importedAt: '2026-09-20',
    },
    createdAt: '2026-09-20T00:00:00.000Z',
  },
];
