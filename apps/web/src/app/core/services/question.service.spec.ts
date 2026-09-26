import { TestBed } from '@angular/core/testing';

import { QuestionService } from './question.service';
import { QUESTIONS_SEED } from '../../data/questions.seed';
import { ArithmeticRow, Question } from '../models/question.model';

function calculateAnswerFromRows(rows: ArithmeticRow[]): number {
  if (rows.length === 0) {
    throw new Error('rows must contain at least one value');
  }

  let result = rows[0].value;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];

    if (row.operator === '-') {
      result -= row.value;
    } else {
      result += row.value;
    }
  }

  return result;
}

describe('QuestionService', () => {
  let service: QuestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionService);
  });

  // =====================================================
  // SEED DATA
  // =====================================================

  it('seed questions are available', () => {
    const questions = service.getAllQuestions();

    expect(questions.length).toBeGreaterThan(0);
  });

  it('has at least 20 questions', () => {
    const questions = service.getAllQuestions();

    expect(questions.length).toBeGreaterThanOrEqual(20);
  });

  it('every question has at least 3 options', () => {
    const questions = service.getAllQuestions();

    for (const question of questions) {
      expect(question.options.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("every question uses topicId 'single-digit-addition'", () => {
    const questions = service.getAllQuestions();

    for (const question of questions) {
      expect(question.topicId).toBe('single-digit-addition');
    }
  });

  it("every question type is 'SIMPLE_ARITHMETIC'", () => {
    const questions = service.getAllQuestions();

    for (const question of questions) {
      expect(question.type).toBe('SIMPLE_ARITHMETIC');
    }
  });

  // =====================================================
  // ARITHMETIC ROWS
  // =====================================================

  it('first arithmetic row has no operator', () => {
    const questions = service.getAllQuestions();

    for (const question of questions) {
      expect(question.rows[0].operator).toBeUndefined();
    }
  });

  it('arithmetic rows use supported operators', () => {
    const questions = service.getAllQuestions();

    for (const question of questions) {
      for (const row of question.rows.slice(1)) {
        expect(['+', '-', undefined]).toContain(row.operator);
      }
    }
  });

  it('several 3-row questions exist', () => {
    const questions = service.getAllQuestions();

    const threeRowCount = questions.filter((question) => question.rows.length === 3).length;

    expect(threeRowCount).toBeGreaterThanOrEqual(3);
  });

  // =====================================================
  // ANSWERS
  // =====================================================

  it('correctOptionId points to the option containing the calculated answer', () => {
    const questions = service.getAllQuestions();

    for (const question of questions) {
      const calculatedAnswer = calculateAnswerFromRows(question.rows);

      const correctOption = question.options.find(
        (option) => option.id === question.correctOptionId,
      );

      expect(correctOption).toBeDefined();
      expect(correctOption?.value).toBe(calculatedAnswer);
    }
  });

  it('explanation matches the calculated answer', () => {
    const questions = service.getAllQuestions();

    for (const question of questions) {
      const calculatedAnswer = calculateAnswerFromRows(question.rows);

      expect(question.explanation).toBeDefined();
      expect(question.explanation).toContain(String(calculatedAnswer));
    }
  });

  // =====================================================
  // TOPIC FILTERING
  // =====================================================

  it('getQuestionsByTopic() filters correctly', () => {
    const filtered = service.getQuestionsByTopic('single-digit-addition');

    expect(filtered.length).toBeGreaterThan(0);

    for (const question of filtered) {
      expect(question.topicId).toBe('single-digit-addition');
    }

    const empty = service.getQuestionsByTopic('non-existent-topic');

    expect(empty).toHaveLength(0);
  });

  // =====================================================
  // RANDOM QUESTIONS
  // =====================================================

  it("getRandomQuestions(10, 'single-digit-addition') returns exactly 10 unique IDs", () => {
    const randomQuestions = service.getRandomQuestions(10, 'single-digit-addition');

    expect(randomQuestions).toHaveLength(10);

    const ids = randomQuestions.map((question) => question.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(10);
  });

  // =====================================================
  // IMMUTABILITY
  // =====================================================

  it('getAllQuestions() does not mutate seed data', () => {
    const seedSnapshot = JSON.stringify(QUESTIONS_SEED);

    const allQuestions = service.getAllQuestions();

    allQuestions[0].rows[0].value = 999;
    allQuestions[0].options[0].value = 999;
    allQuestions[0].topicId = 'mutated-topic';

    expect(JSON.stringify(QUESTIONS_SEED)).toBe(seedSnapshot);
  });

  it('getRandomQuestions() does not mutate seed data', () => {
    const seedSnapshot = JSON.stringify(QUESTIONS_SEED);

    const randomQuestions: Question[] = service.getRandomQuestions(10, 'single-digit-addition');

    randomQuestions[0].rows[0].value = 777;
    randomQuestions[0].options[0].value = 777;
    randomQuestions[0].correctOptionId = 'mutated';

    expect(JSON.stringify(QUESTIONS_SEED)).toBe(seedSnapshot);
  });
});
