import { ComponentFixture, TestBed } from '@angular/core/testing';

import type { AssessmentQuestionSnapshot } from '../../core/models/assessment.model';

import { AssessmentSessionComponent, QuestionPaletteItem } from './assessment-session.component';

describe('AssessmentSessionComponent', () => {
  let fixture: ComponentFixture<AssessmentSessionComponent>;
  let component: AssessmentSessionComponent;

  const question: AssessmentQuestionSnapshot = {
    questionId: 'q1',

    questionSnapshot: {
      id: 'q1',
      type: 'SIMPLE_ARITHMETIC',
      subjectId: 'abacus',
      topicId: 'single-digit-addition',
      difficulty: 'EASY',

      rows: [{ value: 2 }, { value: 3 }, { value: 1 }],

      options: [
        { id: 'q1-a', value: 5 },
        { id: 'q1-b', value: 6 },
        { id: 'q1-c', value: 7 },
        { id: 'q1-d', value: 8 },
      ],

      correctOptionId: 'q1-b',
      createdAt: '2026-09-20T00:00:00.000Z',
    },
  };

  const questionPalette: QuestionPaletteItem[] = [
    {
      number: 1,
      answered: true,
      flagged: false,
    },
    {
      number: 2,
      answered: false,
      flagged: true,
    },
    {
      number: 3,
      answered: false,
      flagged: false,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentSessionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssessmentSessionComponent);

    component = fixture.componentInstance;

    component.question = question;

    component.currentQuestionIndex = 0;

    component.totalQuestions = 100;

    component.selectedOptionId = null;

    component.flagged = false;

    component.timeRemainingLabel = '15:00';

    component.questionPalette = questionPalette;

    fixture.detectChanges();
  });

  // =====================================================
  // BASIC CREATION
  // =====================================================

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  // =====================================================
  // HEADER
  // =====================================================

  it('renders LearnNest brand name', () => {
    expect(fixture.nativeElement.textContent).toContain('LearnNest');
  });

  it('renders assessment subtitle', () => {
    expect(fixture.nativeElement.textContent).toContain('Small Steps, Big Futures.');
  });

  it('renders the current question number', () => {
    expect(fixture.nativeElement.textContent).toContain('Question 1 of 100');
  });

  it('renders assessment duration', () => {
    expect(fixture.nativeElement.textContent).toContain('Duration: 15:00');
  });

  // =====================================================
  // QUESTION AND OPTIONS
  // =====================================================

  it('renders the four answer options', () => {
    const options = fixture.nativeElement.querySelectorAll('app-answer-option');

    expect(options).toHaveLength(4);
  });

  it('returns the correct question number', () => {
    component.currentQuestionIndex = 4;

    expect(component.questionNumber).toBe(5);
  });

  it('returns question options', () => {
    expect(component.options).toHaveLength(4);

    expect(component.options[0].id).toBe('q1-a');
  });

  // =====================================================
  // PREVIOUS AND NEXT BUTTONS
  // =====================================================

  it('disables Previous on the first question', () => {
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];

    const previousButton = buttons.find((button) => button.textContent?.includes('Prev'));

    expect(previousButton).toBeDefined();

    expect(previousButton?.disabled).toBe(true);
  });

  it('enables Previous when not on the first question', () => {
    fixture.componentRef.setInput('currentQuestionIndex', 1);

    fixture.detectChanges();

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];

    const previousButton = buttons.find((button) => button.textContent?.includes('Prev'));

    expect(previousButton).toBeDefined();

    expect(previousButton?.disabled).toBe(false);
  });

  it('renders Next button when not on the last question', () => {
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];

    const nextButton = buttons.find((button) => button.textContent?.includes('Next'));

    expect(nextButton).toBeDefined();

    expect(nextButton?.disabled).toBe(false);
  });

  it('renders Submit button on the last question', () => {
    fixture.componentRef.setInput('currentQuestionIndex', 99);

    fixture.detectChanges();

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];

    const submitButton = buttons.find((button) => button.textContent?.includes('Submit'));

    expect(submitButton).toBeDefined();
  });

  // =====================================================
  // OUTPUT EVENTS
  // =====================================================

  it('emits optionSelected', () => {
    const emitSpy = vi.spyOn(component.optionSelected, 'emit');

    component.onOptionSelected('q1-c');

    expect(emitSpy).toHaveBeenCalledWith('q1-c');
  });

  it('emits previous', () => {
    const emitSpy = vi.spyOn(component.previous, 'emit');

    component.onPrevious();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('emits next', () => {
    const emitSpy = vi.spyOn(component.next, 'emit');

    component.onNext();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('emits flag', () => {
    const emitSpy = vi.spyOn(component.flag, 'emit');

    component.onFlag();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('emits clearAnswer', () => {
    const emitSpy = vi.spyOn(component.clearAnswer, 'emit');

    component.onClear();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('emits submitAssessment', () => {
    const emitSpy = vi.spyOn(component.submitAssessment, 'emit');

    component.onSubmitAssessment();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('emits questionNavigate with the correct index', () => {
    const emitSpy = vi.spyOn(component.questionNavigate, 'emit');

    component.onQuestionNavigate(5);

    expect(emitSpy).toHaveBeenCalledWith(5);
  });

  // =====================================================
  // INPUT PROPERTIES
  // =====================================================

  it('accepts selected option ID', () => {
    component.selectedOptionId = 'q1-c';

    expect(component.selectedOptionId).toBe('q1-c');
  });

  it('accepts flagged state', () => {
    component.flagged = true;

    expect(component.flagged).toBe(true);
  });

  it('accepts question palette', () => {
    expect(component.questionPalette).toHaveLength(3);

    expect(component.questionPalette[0].answered).toBe(true);

    expect(component.questionPalette[1].flagged).toBe(true);
  });

  // =====================================================
  // QUESTION PALETTE
  // =====================================================

  it('renders question palette items', () => {
    const paletteButtons = fixture.nativeElement.querySelectorAll('aside button');

    expect(paletteButtons).toHaveLength(3);
  });

  it('marks current question with active styling', () => {
    const paletteButtons = fixture.nativeElement.querySelectorAll('aside button');

    expect(paletteButtons[0].className).toContain('bg-indigo-600');
  });

  it('renders answered question with green styling', () => {
    fixture.componentRef.setInput('currentQuestionIndex', 2);

    fixture.detectChanges();

    const updatedButtons = fixture.nativeElement.querySelectorAll('aside button');

    expect(updatedButtons[0].className).toContain('bg-emerald-100');
  });

  it('renders flagged question with red styling', () => {
    fixture.componentRef.setInput('currentQuestionIndex', 2);

    fixture.detectChanges();

    const paletteButtons = fixture.nativeElement.querySelectorAll('aside button');

    expect(paletteButtons[1].className).toContain('bg-orange-100');
  });

  it('emits question navigation when palette item is clicked', () => {
    const emitSpy = vi.spyOn(component.questionNavigate, 'emit');

    const paletteButtons = fixture.nativeElement.querySelectorAll('aside button');

    paletteButtons[1].click();

    expect(emitSpy).toHaveBeenCalledWith(1);
  });
});
