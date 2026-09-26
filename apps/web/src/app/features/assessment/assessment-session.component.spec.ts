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

  it('renders the assessment title', () => {
    expect(fixture.nativeElement.textContent).toContain('Abacus Olympiad');
  });

  it('renders the mock test label', () => {
    expect(fixture.nativeElement.textContent).toContain(
      'Written Round | MOCK TEST | 15 Min | Level 1',
    );
  });

  it('renders the current question number', () => {
    expect(fixture.nativeElement.textContent).toContain('Question: 1');
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
    const previousButton = fixture.nativeElement.querySelector(
      'button[aria-label="Previous question"]',
    ) as HTMLButtonElement | null;

    expect(previousButton).not.toBeNull();
    expect(previousButton?.disabled).toBe(true);
  });

  it('enables Previous when not on the first question', () => {
    fixture.componentRef.setInput('currentQuestionIndex', 1);

    fixture.detectChanges();

    const previousButton = fixture.nativeElement.querySelector(
      'button[aria-label="Previous question"]',
    ) as HTMLButtonElement | null;

    expect(previousButton).not.toBeNull();
    expect(previousButton?.disabled).toBe(false);
  });

  it('renders Next button when not on the last question', () => {
    fixture.componentRef.setInput('currentQuestionIndex', 0);

    fixture.detectChanges();

    const nextButton = fixture.nativeElement.querySelector(
      'button[aria-label="Next question"]',
    ) as HTMLButtonElement | null;

    expect(nextButton).not.toBeNull();
  });

  it('does not render Next button on the last question', () => {
    fixture.componentRef.setInput('currentQuestionIndex', 99);

    fixture.detectChanges();

    const nextButton = fixture.nativeElement.querySelector(
      'button[aria-label="Next question"]',
    ) as HTMLButtonElement | null;

    expect(nextButton).toBeNull();
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

  // =====================================================
  // QUESTION PALETTE
  // =====================================================

  // =====================================================
  // QUESTION PALETTE
  // =====================================================

  it('renders question palette items', () => {
    const sections = fixture.nativeElement.querySelectorAll('section') as NodeListOf<HTMLElement>;

    const paletteSection = sections[sections.length - 1];

    expect(paletteSection).toBeDefined();

    const paletteButtons = paletteSection.querySelectorAll('button');

    expect(paletteButtons.length).toBeGreaterThanOrEqual(3);
  });

  it('marks current question with active styling', () => {
    const sections = fixture.nativeElement.querySelectorAll('section') as NodeListOf<HTMLElement>;

    const paletteSection = sections[sections.length - 1];

    const paletteButtons = paletteSection.querySelectorAll('button');

    expect(paletteButtons[0].className).toContain('bg-white');
    expect(paletteButtons[0].className).toContain('text-[#0789bd]');
  });

  it('renders answered question with answered styling', () => {
    fixture.componentRef.setInput('currentQuestionIndex', 2);

    fixture.detectChanges();

    const sections = fixture.nativeElement.querySelectorAll('section') as NodeListOf<HTMLElement>;

    const paletteSection = sections[sections.length - 1];

    const paletteButtons = paletteSection.querySelectorAll('button');

    expect(paletteButtons[0].className).toContain('bg-[#b8e6f5]');
  });

  it('renders flagged question with yellow styling', () => {
    fixture.componentRef.setInput('currentQuestionIndex', 2);

    fixture.detectChanges();

    const sections = fixture.nativeElement.querySelectorAll('section') as NodeListOf<HTMLElement>;

    const paletteSection = sections[sections.length - 1];

    const paletteButtons = paletteSection.querySelectorAll('button');

    expect(paletteButtons[1].className).toContain('bg-yellow-300');
  });

  it('emits question navigation when palette item is clicked', () => {
    const emitSpy = vi.spyOn(component.questionNavigate, 'emit');

    const sections = fixture.nativeElement.querySelectorAll('section') as NodeListOf<HTMLElement>;

    const paletteSection = sections[sections.length - 1];

    const paletteButtons = paletteSection.querySelectorAll('button');

    expect(paletteButtons.length).toBeGreaterThanOrEqual(3);

    (paletteButtons[1] as HTMLButtonElement).click();

    expect(emitSpy).toHaveBeenCalledWith(1);
  });
});
