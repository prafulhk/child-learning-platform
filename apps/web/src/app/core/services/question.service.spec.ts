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

  it('seed questions are available', () => {
    const questions = service.getAllQuestions();
    expect(questions.length).toBeGreaterThan(0);
  });

  it('has at least 20 questions', () => {
    const questions = service.getAllQuestions();
    expect(questions.length).toBeGreaterThanOrEqual(20);
  });

  it('every question has exactly 4 options', () => {
    const questions = service.getAllQuestions();
    for (const q of questions) {
      expect(q.options.length).toBe(4);
    }
  });

  it("every question uses topicId 'single-digit-addition'", () => {
    const questions = service.getAllQuestions();
    for (const q of questions) {
      expect(q.topicId).toBe('single-digit-addition');
    }
  });

  it("every question type is 'SIMPLE_ARITHMETIC'", () => {
    const questions = service.getAllQuestions();
    for (const q of questions) {
      expect(q.type).toBe('SIMPLE_ARITHMETIC');
    }
  });

  it('first arithmetic row has no operator', () => {
    const questions = service.getAllQuestions();
    for (const q of questions) {
      expect(q.rows[0].operator).toBeUndefined();
    }
  });

  it("no seed row uses operator '-'", () => {
    const questions = service.getAllQuestions();
    for (const q of questions) {
      expect(q.rows[0].operator).toBeUndefined();

      for (const row of q.rows.slice(1)) {
        expect([undefined, '-']).toContain(row.operator);
      }
    }
  });

  it('several 3-row questions exist', () => {
    const questions = service.getAllQuestions();
    const threeRowCount = questions.filter((q) => q.rows.length === 3).length;
    expect(threeRowCount).toBeGreaterThanOrEqual(3);
  });

  it('correctOptionId points to option containing calculated answer', () => {
    const questions = service.getAllQuestions();

    for (const q of questions) {
      const calculated = calculateAnswerFromRows(q.rows);
      const correctOption = q.options.find((o) => o.id === q.correctOptionId);

      expect(correctOption).toBeDefined();
      expect(correctOption?.value).toBe(calculated);
    }
  });

  it('explanation matches calculated answer', () => {
    const questions = service.getAllQuestions();

    for (const q of questions) {
      const calculated = calculateAnswerFromRows(q.rows);
      expect(q.explanation).toBeDefined();
      expect(q.explanation).toContain(String(calculated));
    }
  });

  it('getQuestionsByTopic() filters correctly', () => {
    const filtered = service.getQuestionsByTopic('single-digit-addition');

    expect(filtered.length).toBeGreaterThan(0);
    for (const q of filtered) {
      expect(q.topicId).toBe('single-digit-addition');
    }

    const empty = service.getQuestionsByTopic('non-existent-topic');
    expect(empty.length).toBe(0);
  });

  it("getRandomQuestions(10, 'single-digit-addition') returns exactly 10 unique IDs", () => {
    const randomQuestions = service.getRandomQuestions(10, 'single-digit-addition');

    expect(randomQuestions.length).toBe(10);

    const ids = randomQuestions.map((q) => q.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(10);
  });

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
