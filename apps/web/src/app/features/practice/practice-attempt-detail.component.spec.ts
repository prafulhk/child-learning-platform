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

  // =====================================================
  // BASIC CREATION
  // =====================================================

  it('creates the component', () => {
    const fixture = createFixture();

    expect(fixture.componentInstance).toBeTruthy();
  });

  // =====================================================
  // HEADER
  // =====================================================

  it('renders Practice Review title', () => {
    const fixture = createFixture();

    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Practice Review');
  });

  it('renders completed date', () => {
    const fixture = createFixture();

    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('2026');
  });

  // =====================================================
  // PERFORMANCE SUMMARY
  // =====================================================

  it('renders accuracy', () => {
    const fixture = createFixture();

    expect(fixture.nativeElement.textContent as string).toContain('33%');
  });

  it('renders correct count', () => {
    const fixture = createFixture();

    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Correct');
    expect(text).toContain('1');
  });

  it('renders incorrect count', () => {
    const fixture = createFixture();

    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Incorrect');
    expect(text).toContain('1');
  });

  it('renders unanswered count', () => {
    const fixture = createFixture();

    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Unanswered');
    expect(text).toContain('1');
  });

  it('renders total questions', () => {
    const fixture = createFixture();

    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Total Questions');
    expect(text).toContain('3');
  });

  it('renders duration', () => {
    const fixture = createFixture();

    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('3:42');
  });

  it('renders topic', () => {
    const fixture = createFixture();

    expect(fixture.nativeElement.textContent as string).toContain('single-digit-addition');
  });

  // =====================================================
  // QUESTIONS
  // =====================================================

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

  // =====================================================
  // OPTIONS
  // =====================================================

  it('renders all options for the first question', () => {
    const fixture = createFixture();

    const firstQuestion = fixture.nativeElement.querySelector(
      '[data-testid="attempt-question"][data-question-id="q-1"]',
    ) as HTMLElement | null;

    expect(firstQuestion).toBeTruthy();

    const options = Array.from(
      firstQuestion!.querySelectorAll('[data-testid="question-option"]'),
    ) as HTMLElement[];

    expect(options).toHaveLength(4);
  });

  it('preserves option order', () => {
    const fixture = createFixture();

    const firstQuestion = fixture.nativeElement.querySelector(
      '[data-testid="attempt-question"][data-question-id="q-1"]',
    ) as HTMLElement | null;

    expect(firstQuestion).toBeTruthy();

    const options = Array.from(
      firstQuestion!.querySelectorAll('[data-testid="question-option"]'),
    ) as HTMLElement[];

    expect(options.map((option) => option.getAttribute('data-option-id'))).toEqual([
      'q-1-opt-1',
      'q-1-opt-2',
      'q-1-opt-3',
      'q-1-opt-4',
    ]);
  });

  // =====================================================
  // SELECTED OPTIONS
  // =====================================================

  it('marks selected options with blue styling', () => {
    const fixture = createFixture();

    const selectedOptions = fixture.nativeElement.querySelectorAll(
      '[data-testid="question-option"].border-blue-400',
    );

    expect(selectedOptions).toHaveLength(2);
  });

  it('shows Your answer for selected options', () => {
    const fixture = createFixture();

    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Your answer');
  });

  it('marks q-1 option 2 as the selected answer', () => {
    const fixture = createFixture();

    const option = fixture.nativeElement.querySelector(
      '[data-testid="question-option"][data-option-id="q-1-opt-2"]',
    ) as HTMLElement | null;

    expect(option).toBeTruthy();

    expect(option!.classList.contains('border-blue-400')).toBe(true);

    expect(option!.classList.contains('bg-blue-50')).toBe(true);
  });

  it('marks q-2 option 1 as the selected answer', () => {
    const fixture = createFixture();

    const option = fixture.nativeElement.querySelector(
      '[data-testid="question-option"][data-option-id="q-2-opt-1"]',
    ) as HTMLElement | null;

    expect(option).toBeTruthy();

    expect(option!.classList.contains('border-blue-400')).toBe(true);

    expect(option!.classList.contains('bg-blue-50')).toBe(true);
  });

  // =====================================================
  // CORRECT OPTIONS
  // =====================================================

  it('shows Correct badge for every correct answer', () => {
    const fixture = createFixture();

    const questions = Array.from(
      fixture.nativeElement.querySelectorAll('[data-testid="attempt-question"]'),
    ) as HTMLElement[];

    for (const question of questions) {
      const correctBadges = Array.from(question.querySelectorAll('span')).filter(
        (element) => element.textContent?.trim() === 'Correct',
      );

      expect(correctBadges.length).toBeGreaterThan(0);
    }
  });

  it('marks the correct option for q-2', () => {
    const fixture = createFixture();

    const question = fixture.nativeElement.querySelector(
      '[data-testid="attempt-question"][data-question-id="q-2"]',
    ) as HTMLElement | null;

    expect(question).toBeTruthy();

    const correctOption = question!.querySelector(
      '[data-testid="question-option"][data-option-id="q-2-opt-2"]',
    ) as HTMLElement | null;

    expect(correctOption).toBeTruthy();

    expect(correctOption!.classList.contains('border-emerald-400')).toBe(true);

    expect(correctOption!.classList.contains('bg-emerald-50')).toBe(true);
  });

  it('marks the correct option for q-3', () => {
    const fixture = createFixture();

    const question = fixture.nativeElement.querySelector(
      '[data-testid="attempt-question"][data-question-id="q-3"]',
    ) as HTMLElement | null;

    expect(question).toBeTruthy();

    const correctOption = question!.querySelector(
      '[data-testid="question-option"][data-option-id="q-3-opt-3"]',
    ) as HTMLElement | null;

    expect(correctOption).toBeTruthy();

    expect(correctOption!.classList.contains('border-emerald-400')).toBe(true);

    expect(correctOption!.classList.contains('bg-emerald-50')).toBe(true);
  });

  // =====================================================
  // QUESTION STATUS
  // =====================================================

  it('identifies correct answer question', () => {
    const fixture = createFixture();

    const question = fixture.nativeElement.querySelector(
      '[data-testid="attempt-question"][data-question-id="q-1"]',
    ) as HTMLElement | null;

    expect(question).toBeTruthy();

    const status = question!.querySelector('[data-testid="question-status"]')?.textContent?.trim();

    expect(status).toBe('Correct');
  });

  it('identifies incorrect answer question', () => {
    const fixture = createFixture();

    const question = fixture.nativeElement.querySelector(
      '[data-testid="attempt-question"][data-question-id="q-2"]',
    ) as HTMLElement | null;

    expect(question).toBeTruthy();

    const status = question!.querySelector('[data-testid="question-status"]')?.textContent?.trim();

    expect(status).toBe('Incorrect');
  });

  it('identifies unanswered question', () => {
    const fixture = createFixture();

    const question = fixture.nativeElement.querySelector(
      '[data-testid="attempt-question"][data-question-id="q-3"]',
    ) as HTMLElement | null;

    expect(question).toBeTruthy();

    const status = question!.querySelector('[data-testid="question-status"]')?.textContent?.trim();

    expect(status).toBe('Unanswered');
  });

  // =====================================================
  // BACK TO HISTORY
  // =====================================================

  it('emits backToHistory when Back to History is clicked', () => {
    const fixture = createFixture();

    const component = fixture.componentInstance;

    const emitSpy = vi.spyOn(component.backToHistory, 'emit');

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];

    const backButton = buttons.find((button) => button.textContent?.includes('Back to History'));

    expect(backButton).toBeTruthy();

    backButton!.click();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  // =====================================================
  // COMPONENT METHODS
  // =====================================================

  it('returns selected option id', () => {
    const fixture = createFixture();

    const component = fixture.componentInstance;

    expect(component.getSelectedOptionId('q-1')).toBe('q-1-opt-2');

    expect(component.getSelectedOptionId('q-3')).toBeNull();
  });

  it('identifies selected option', () => {
    const fixture = createFixture();

    const component = fixture.componentInstance;

    expect(component.isSelectedOption('q-1', 'q-1-opt-2')).toBe(true);

    expect(component.isSelectedOption('q-1', 'q-1-opt-1')).toBe(false);
  });

  it('identifies correct option', () => {
    const fixture = createFixture();

    const component = fixture.componentInstance;

    const question = attemptFixture.presentedQuestions[0];

    const correctOption = question.questionSnapshot.options[1];

    const incorrectOption = question.questionSnapshot.options[0];

    expect(component.isCorrectOption(question, correctOption)).toBe(true);

    expect(component.isCorrectOption(question, incorrectOption)).toBe(false);
  });

  it('returns correct question status', () => {
    const fixture = createFixture();

    const component = fixture.componentInstance;

    expect(component.getQuestionStatus(attemptFixture.presentedQuestions[0])).toBe('CORRECT');

    expect(component.getQuestionStatus(attemptFixture.presentedQuestions[1])).toBe('INCORRECT');

    expect(component.getQuestionStatus(attemptFixture.presentedQuestions[2])).toBe('UNANSWERED');
  });

  it('returns correct question status label', () => {
    const fixture = createFixture();

    const component = fixture.componentInstance;

    expect(component.getQuestionStatusLabel(attemptFixture.presentedQuestions[0])).toBe('Correct');

    expect(component.getQuestionStatusLabel(attemptFixture.presentedQuestions[1])).toBe(
      'Incorrect',
    );

    expect(component.getQuestionStatusLabel(attemptFixture.presentedQuestions[2])).toBe(
      'Unanswered',
    );
  });

  // =====================================================
  // ACCURACY COLOR
  // =====================================================

  it('returns rose color for accuracy below 60', () => {
    const fixture = createFixture();

    expect(fixture.componentInstance.getAccuracyColor()).toBe('from-rose-600 to-red-600');
  });

  it('returns amber color for accuracy from 60 to 79', () => {
    const fixture = createFixture();

    fixture.componentRef.setInput('attempt', {
      ...attemptFixture,
      result: {
        ...attemptFixture.result,
        accuracyPercentage: 60,
      },
    });

    fixture.detectChanges();

    expect(fixture.componentInstance.getAccuracyColor()).toBe('from-amber-600 to-orange-600');
  });

  it('returns emerald color for accuracy of 80 or above', () => {
    const fixture = createFixture();

    fixture.componentRef.setInput('attempt', {
      ...attemptFixture,
      result: {
        ...attemptFixture.result,
        accuracyPercentage: 80,
      },
    });

    fixture.detectChanges();

    expect(fixture.componentInstance.getAccuracyColor()).toBe('from-emerald-600 to-green-600');
  });

  // =====================================================
  // DURATION
  // =====================================================

  it('formats duration correctly', () => {
    const fixture = createFixture();

    expect(
      fixture.componentInstance.formatDuration('2026-09-19T10:00:00Z', '2026-09-19T10:03:42Z'),
    ).toBe('3:42');
  });

  it('returns 0:00 for invalid duration dates', () => {
    const fixture = createFixture();

    expect(fixture.componentInstance.formatDuration('invalid', 'invalid')).toBe('0:00');
  });
});
