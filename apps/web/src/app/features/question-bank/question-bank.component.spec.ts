import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Question } from '../../core/models/question.model';
import { QuestionService } from '../../core/services/question.service';
import { QuestionBankComponent } from './question-bank.component';

describe('QuestionBankComponent', () => {
  const buildQuestion = (overrides: Partial<Question>): Question => ({
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
    correctOptionId: 'opt_b',
    createdAt: '2026-09-19T00:00:00Z',
    ...overrides,
  });

  let mockQuestionService: { getQuestionsByTopic: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockQuestionService = {
      getQuestionsByTopic: vi.fn().mockReturnValue([]),
    };

    await TestBed.configureTestingModule({
      imports: [QuestionBankComponent],
      providers: [{ provide: QuestionService, useValue: mockQuestionService }],
    }).compileComponents();
  });

  const createFixture = (): ComponentFixture<QuestionBankComponent> => {
    const fixture = TestBed.createComponent(QuestionBankComponent);
    fixture.detectChanges();

    return fixture;
  };

  it('renders Question Bank', () => {
    const fixture = createFixture();

    expect(fixture.nativeElement.textContent as string).toContain('Question Bank');
  });

  it('renders subject', () => {
    const fixture = createFixture();

    expect(fixture.nativeElement.textContent as string).toContain('Abacus');
  });

  it('renders topic', () => {
    const fixture = createFixture();

    expect(fixture.nativeElement.textContent as string).toContain('Single-Digit Addition');
  });

  it('renders seeded questions', () => {
    mockQuestionService.getQuestionsByTopic.mockReturnValue([buildQuestion({ id: 'q001' })]);

    const fixture = createFixture();

    expect(fixture.nativeElement.querySelectorAll('[data-testid="question-id"]').length).toBe(1);
  });

  it('renders question IDs', () => {
    mockQuestionService.getQuestionsByTopic.mockReturnValue([buildQuestion({ id: 'q123' })]);

    const fixture = createFixture();

    expect(fixture.nativeElement.textContent as string).toContain('ID: q123');
  });

  it('renders difficulty', () => {
    mockQuestionService.getQuestionsByTopic.mockReturnValue([
      buildQuestion({ id: 'q123', difficulty: 'HARD' }),
    ]);

    const fixture = createFixture();

    expect(fixture.nativeElement.textContent as string).toContain('HARD');
  });

  it('renders row count', () => {
    mockQuestionService.getQuestionsByTopic.mockReturnValue([
      buildQuestion({ id: 'q123', rows: [{ value: 1 }, { value: 2 }, { value: 3 }] }),
    ]);

    const fixture = createFixture();

    expect(fixture.nativeElement.textContent as string).toContain('3 rows');
  });

  it('renders multiple questions', () => {
    mockQuestionService.getQuestionsByTopic.mockReturnValue([
      buildQuestion({ id: 'q001' }),
      buildQuestion({ id: 'q002' }),
      buildQuestion({ id: 'q003' }),
    ]);

    const fixture = createFixture();

    expect(fixture.nativeElement.querySelectorAll('article').length).toBe(3);
  });

  it('supports 3-row questions', () => {
    mockQuestionService.getQuestionsByTopic.mockReturnValue([
      buildQuestion({
        id: 'q333',
        rows: [{ value: 3 }, { value: 2 }, { value: 4 }],
      }),
    ]);

    const fixture = createFixture();

    expect(fixture.nativeElement.textContent as string).toContain('3 rows');
    expect(fixture.nativeElement.textContent as string).toContain('3');
    expect(fixture.nativeElement.textContent as string).toContain('2');
    expect(fixture.nativeElement.textContent as string).toContain('4');
  });

  it('shows empty state when there are no questions', () => {
    mockQuestionService.getQuestionsByTopic.mockReturnValue([]);

    const fixture = createFixture();

    expect(fixture.nativeElement.textContent as string).toContain(
      'No questions in the Question Bank yet.',
    );
  });
});
