import { TestBed } from '@angular/core/testing';
import { PracticeAttempt } from '../../core/services/local-storage.service';
import { PracticeAttemptDetailComponent } from './practice-attempt-detail.component';

describe('PracticeAttemptDetailComponent', () => {
  const attemptFixture: PracticeAttempt = {
    id: 'attempt-42',
    topicId: 'single-digit-addition',
    startedAt: '2026-09-19T10:00:00Z',
    completedAt: '2026-09-19T10:03:42Z',
    selectedAnswers: {
      'q-1': 'q-1-opt-2',
      'q-2': 'q-2-opt-1',
    },
    presentedQuestions: [
      {
        questionId: 'q-1',
        questionSnapshot: {
          id: 'q-1',
          type: 'SIMPLE_ARITHMETIC',
          subjectId: 'abacus',
          topicId: 'single-digit-addition',
          difficulty: 'EASY',
          rows: [{ value: 3 }, { value: 2 }],
          options: [
            { id: 'q-1-opt-1', value: 4 },
            { id: 'q-1-opt-2', value: 5 },
            { id: 'q-1-opt-3', value: 6 },
            { id: 'q-1-opt-4', value: 7 },
          ],
          correctOptionId: 'q-1-opt-2',
          createdAt: '2026-09-18T09:00:00Z',
        },
      },
      {
        questionId: 'q-2',
        questionSnapshot: {
          id: 'q-2',
          type: 'SIMPLE_ARITHMETIC',
          subjectId: 'abacus',
          topicId: 'single-digit-addition',
          difficulty: 'EASY',
          rows: [{ value: 4 }, { value: 1 }],
          options: [
            { id: 'q-2-opt-1', value: 4 },
            { id: 'q-2-opt-2', value: 5 },
            { id: 'q-2-opt-3', value: 6 },
            { id: 'q-2-opt-4', value: 7 },
          ],
          correctOptionId: 'q-2-opt-2',
          createdAt: '2026-09-18T09:01:00Z',
        },
      },
      {
        questionId: 'q-3',
        questionSnapshot: {
          id: 'q-3',
          type: 'SIMPLE_ARITHMETIC',
          subjectId: 'abacus',
          topicId: 'single-digit-addition',
          difficulty: 'EASY',
          rows: [{ value: 2 }, { value: 2 }],
          options: [
            { id: 'q-3-opt-1', value: 2 },
            { id: 'q-3-opt-2', value: 3 },
            { id: 'q-3-opt-3', value: 4 },
            { id: 'q-3-opt-4', value: 5 },
          ],
          correctOptionId: 'q-3-opt-3',
          createdAt: '2026-09-18T09:02:00Z',
        },
      },
    ],
    result: {
      totalQuestions: 3,
      correctCount: 1,
      incorrectCount: 1,
      unansweredCount: 1,
      accuracyPercentage: 33,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticeAttemptDetailComponent],
    }).compileComponents();
  });

  const createFixture = () => {
    const fixture = TestBed.createComponent(PracticeAttemptDetailComponent);
    fixture.componentRef.setInput('attempt', attemptFixture);
    fixture.detectChanges();

    return fixture;
  };

  it('renders Practice Attempt', () => {
    const fixture = createFixture();

    expect(fixture.nativeElement.textContent as string).toContain('Practice Attempt');
  });

  it('renders accuracy', () => {
    const fixture = createFixture();

    expect(fixture.nativeElement.textContent as string).toContain('33%');
  });

  it('renders correct count', () => {
    const fixture = createFixture();

    expect(fixture.nativeElement.textContent as string).toContain('Correct');
    expect(fixture.nativeElement.textContent as string).toContain('1');
  });

  it('renders incorrect count', () => {
    const fixture = createFixture();

    expect(fixture.nativeElement.textContent as string).toContain('Incorrect');
  });

  it('renders unanswered count', () => {
    const fixture = createFixture();

    expect(fixture.nativeElement.textContent as string).toContain('Unanswered');
  });

  it('renders total questions', () => {
    const fixture = createFixture();

    expect(fixture.nativeElement.textContent as string).toContain('Total Questions');
    expect(fixture.nativeElement.textContent as string).toContain('3');
  });

  it('renders duration', () => {
    const fixture = createFixture();

    expect(fixture.nativeElement.textContent as string).toContain('3:42');
  });

  it('renders all questions', () => {
    const fixture = createFixture();

    const questions = fixture.nativeElement.querySelectorAll('[data-testid="attempt-question"]');

    expect(questions.length).toBe(3);
  });

  it('preserves question order', () => {
    const fixture = createFixture();

    const questions = Array.from(
      fixture.nativeElement.querySelectorAll('[data-testid="attempt-question"]'),
    ) as HTMLElement[];

    expect(questions[0].getAttribute('data-question-id')).toBe('q-1');
    expect(questions[1].getAttribute('data-question-id')).toBe('q-2');
    expect(questions[2].getAttribute('data-question-id')).toBe('q-3');
  });

  it('preserves option order', () => {
    const fixture = createFixture();

    const firstQuestion = fixture.nativeElement.querySelector(
      '[data-testid="attempt-question"][data-question-id="q-1"]',
    ) as HTMLElement | null;

    if (!firstQuestion) {
      throw new Error('Expected first question card to exist');
    }

    const options = Array.from(
      firstQuestion.querySelectorAll('[data-testid="question-option"]'),
    ) as HTMLElement[];

    expect(options.map((option) => option.getAttribute('data-option-id'))).toEqual([
      'q-1-opt-1',
      'q-1-opt-2',
      'q-1-opt-3',
      'q-1-opt-4',
    ]);
  });

  it('marks selected option', () => {
    const fixture = createFixture();

    const markers = fixture.nativeElement.querySelectorAll('[data-testid="marker-selected"]');

    expect(markers.length).toBe(2);
    expect(fixture.nativeElement.textContent as string).toContain('Your answer');
  });

  it('marks correct option', () => {
    const fixture = createFixture();

    const markers = fixture.nativeElement.querySelectorAll('[data-testid="marker-correct"]');

    expect(markers.length).toBe(3);
    expect(fixture.nativeElement.textContent as string).toContain('Correct answer');
  });

  it('identifies correct answer', () => {
    const fixture = createFixture();

    const question = fixture.nativeElement.querySelector(
      '[data-testid="attempt-question"][data-question-id="q-1"]',
    ) as HTMLElement | null;

    if (!question) {
      throw new Error('Expected question q-1 card to exist');
    }

    const status = question.querySelector('[data-testid="question-status"]')?.textContent?.trim();

    expect(status).toBe('Correct');
  });

  it('identifies incorrect answer', () => {
    const fixture = createFixture();

    const question = fixture.nativeElement.querySelector(
      '[data-testid="attempt-question"][data-question-id="q-2"]',
    ) as HTMLElement | null;

    if (!question) {
      throw new Error('Expected question q-2 card to exist');
    }

    const status = question.querySelector('[data-testid="question-status"]')?.textContent?.trim();

    expect(status).toBe('Incorrect');
  });

  it('identifies unanswered question', () => {
    const fixture = createFixture();

    const question = fixture.nativeElement.querySelector(
      '[data-testid="attempt-question"][data-question-id="q-3"]',
    ) as HTMLElement | null;

    if (!question) {
      throw new Error('Expected question q-3 card to exist');
    }

    const status = question.querySelector('[data-testid="question-status"]')?.textContent?.trim();

    expect(status).toBe('Unanswered');
  });

  it('emits backToHistory when Back to History is clicked', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance;

    const emitSpy = vi.spyOn(component.backToHistory, 'emit');

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];
    const backButton = buttons.find((button) => button.textContent?.trim() === 'Back to History');

    if (!backButton) {
      throw new Error('Expected Back to History button to exist');
    }

    backButton.click();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });
});
