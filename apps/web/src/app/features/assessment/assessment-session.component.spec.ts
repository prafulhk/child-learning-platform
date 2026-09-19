import { ComponentFixture, TestBed } from '@angular/core/testing';

import type { AssessmentQuestionSnapshot } from '../../core/models/assessment.model';

import { AssessmentSessionComponent } from './assessment-session.component';

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentSessionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssessmentSessionComponent);

    component = fixture.componentInstance;

    component.question = question;
    component.currentQuestionIndex = 0;
    component.totalQuestions = 100;
    component.timeRemainingLabel = '15:00';

    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('renders the assessment title', () => {
    expect(fixture.nativeElement.textContent).toContain('Abacus Olympiad Test');
  });

  it('renders the current question number', () => {
    expect(fixture.nativeElement.textContent).toContain('Question 1 of 100');
  });

  it('renders the remaining time', () => {
    expect(fixture.nativeElement.textContent).toContain('15:00');
  });

  it('renders the four answer options', () => {
    const buttons = fixture.nativeElement.querySelectorAll('app-answer-option');

    expect(buttons).toHaveLength(4);
  });

  it('disables Previous on the first question', () => {
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];

    const previousButton = buttons.find((button) => button.textContent?.trim() === 'Previous');

    expect(previousButton).toBeDefined();
    expect(previousButton?.disabled).toBe(true);
  });

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

  it('emits flag', () => {
    const emitSpy = vi.spyOn(component.flag, 'emit');

    component.onFlag();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('does not render a Next button', () => {
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];

    expect(buttons.some((button) => button.textContent?.trim() === 'Next')).toBe(false);
  });
});
