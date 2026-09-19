import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Question } from '../../core/models/question.model';
import { QuestionFormComponent } from './question-form.component';

describe('QuestionFormComponent', () => {
  const createFixture = (question?: Question | null): ComponentFixture<QuestionFormComponent> => {
    const fixture = TestBed.createComponent(QuestionFormComponent);
    if (question !== undefined) {
      fixture.componentRef.setInput('question', question);
    }
    fixture.detectChanges();
    return fixture;
  };

  const buildFixtureQuestion = (overrides: Partial<Question>): Question => ({
    id: 'question-1',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'EASY',
    rows: [{ value: 3 }, { value: 2 }, { value: 4 }],
    options: [
      { id: 'opt-1', value: 4 },
      { id: 'opt-2', value: 7 },
      { id: 'opt-3', value: 8 },
      { id: 'opt-4', value: 9 },
    ],
    correctOptionId: 'opt-4',
    explanation: '3 + 2 + 4 = 9',
    createdAt: '2026-09-19T00:00:00Z',
    ...overrides,
  });

  const setInputValue = (input: HTMLInputElement | HTMLTextAreaElement, value: string): void => {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  };

  const clickButton = (fixture: ComponentFixture<QuestionFormComponent>, label: string): void => {
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];
    const button = buttons.find((candidate) => candidate.textContent?.trim() === label);

    if (!button) {
      throw new Error(`Expected button with label ${label}`);
    }

    button.click();
    fixture.detectChanges();
  };

  const getEmittedQuestion = (emitSpy: ReturnType<typeof vi.spyOn>): Question => {
    const emittedQuestion = emitSpy.mock.calls[0]?.[0];

    if (!emittedQuestion) {
      throw new Error('Expected a question to be emitted');
    }

    return emittedQuestion as Question;
  };

  const createEditQuestion = (): Question => ({
    id: 'question-edit-1',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'EASY',
    rows: [{ value: 3 }, { value: 2 }, { value: 4 }],
    options: [
      { id: 'opt-1', value: 4 },
      { id: 'opt-2', value: 7 },
      { id: 'opt-3', value: 8 },
      { id: 'opt-4', value: 9 },
    ],
    correctOptionId: 'opt-4',
    explanation: '3 + 2 + 4 = 9',
    createdAt: '2026-09-19T10:00:00Z',
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionFormComponent],
    }).compileComponents();
  });

  it('renders Create Question', () => {
    const fixture = createFixture();

    expect(fixture.nativeElement.textContent as string).toContain('Create Question');
  });

  it('still renders Create Question in create mode', () => {
    const fixture = createFixture(null);

    expect(fixture.nativeElement.textContent as string).toContain('Create Question');
  });

  it('starts with 3 rows', () => {
    const fixture = createFixture();

    expect(
      fixture.nativeElement.querySelectorAll('input[type="number"]').length,
    ).toBeGreaterThanOrEqual(7);
    expect(fixture.nativeElement.textContent as string).toContain('Row 1 value');
    expect(fixture.nativeElement.textContent as string).toContain('Row 2 value');
    expect(fixture.nativeElement.textContent as string).toContain('Row 3 value');
  });

  it('adds a fourth row', () => {
    const fixture = createFixture();

    clickButton(fixture, '+ Add Row');

    expect(fixture.nativeElement.textContent as string).toContain('Row 4 value');
  });

  it('renders 4 options', () => {
    const fixture = createFixture();

    expect(fixture.nativeElement.textContent as string).toContain('Option 1');
    expect(fixture.nativeElement.textContent as string).toContain('Option 2');
    expect(fixture.nativeElement.textContent as string).toContain('Option 3');
    expect(fixture.nativeElement.textContent as string).toContain('Option 4');
  });

  it('saves a valid 3-row addition question', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance;
    const emitSpy = vi.spyOn(component.save, 'emit');

    const numberInputs = Array.from(
      fixture.nativeElement.querySelectorAll('input[type="number"]'),
    ) as HTMLInputElement[];
    setInputValue(numberInputs[0], '3');
    setInputValue(numberInputs[1], '2');
    setInputValue(numberInputs[2], '4');
    setInputValue(numberInputs[3], '4');
    setInputValue(numberInputs[4], '7');
    setInputValue(numberInputs[5], '8');
    setInputValue(numberInputs[6], '9');

    const radios = Array.from(
      fixture.nativeElement.querySelectorAll('input[type="radio"]'),
    ) as HTMLInputElement[];
    radios[3].click();
    fixture.detectChanges();

    setInputValue(
      fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement,
      '3 + 2 + 4 = 9',
    );

    clickButton(fixture, 'Save Question');

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('emits Question with correct arithmetic rows', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance;
    const emitSpy = vi.spyOn(component.save, 'emit');

    const numberInputs = Array.from(
      fixture.nativeElement.querySelectorAll('input[type="number"]'),
    ) as HTMLInputElement[];
    setInputValue(numberInputs[0], '3');
    setInputValue(numberInputs[1], '2');
    setInputValue(numberInputs[2], '4');
    setInputValue(numberInputs[3], '4');
    setInputValue(numberInputs[4], '7');
    setInputValue(numberInputs[5], '8');
    setInputValue(numberInputs[6], '9');

    const radios = Array.from(
      fixture.nativeElement.querySelectorAll('input[type="radio"]'),
    ) as HTMLInputElement[];
    radios[3].click();
    fixture.detectChanges();

    clickButton(fixture, 'Save Question');

    const emittedQuestion = getEmittedQuestion(emitSpy);

    expect(emittedQuestion.rows).toEqual([{ value: 3 }, { value: 2 }, { value: 4 }]);
  });

  it('does not store + operator', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance;
    const emitSpy = vi.spyOn(component.save, 'emit');

    const numberInputs = Array.from(
      fixture.nativeElement.querySelectorAll('input[type="number"]'),
    ) as HTMLInputElement[];
    setInputValue(numberInputs[0], '3');
    setInputValue(numberInputs[1], '2');
    setInputValue(numberInputs[2], '4');
    setInputValue(numberInputs[3], '4');
    setInputValue(numberInputs[4], '7');
    setInputValue(numberInputs[5], '8');
    setInputValue(numberInputs[6], '9');

    const radios = Array.from(
      fixture.nativeElement.querySelectorAll('input[type="radio"]'),
    ) as HTMLInputElement[];
    radios[3].click();
    fixture.detectChanges();

    clickButton(fixture, 'Save Question');

    const emittedQuestion = getEmittedQuestion(emitSpy);

    expect(emittedQuestion.rows[0]).toEqual({ value: 3 });
    expect(emittedQuestion.rows[1]).toEqual({ value: 2 });
  });

  it('generates 4 option IDs', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance;
    const emitSpy = vi.spyOn(component.save, 'emit');

    clickButton(fixture, 'Save Question');

    const emittedQuestion = getEmittedQuestion(emitSpy);

    expect(emittedQuestion.options).toHaveLength(4);
    expect(new Set(emittedQuestion.options.map((option) => option.id)).size).toBe(4);
  });

  it('emits correctOptionId', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance;
    const emitSpy = vi.spyOn(component.save, 'emit');

    clickButton(fixture, 'Save Question');

    const emittedQuestion = getEmittedQuestion(emitSpy);

    expect(emittedQuestion.correctOptionId).toBeTruthy();
    expect(
      emittedQuestion.options.find((option) => option.id === emittedQuestion.correctOptionId)
        ?.value,
    ).toBe(3);
  });

  it('rejects fewer than 3 rows', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance;
    const emitSpy = vi.spyOn(component.save, 'emit');

    component.rows = component.rows.slice(0, 2);
    fixture.detectChanges();

    clickButton(fixture, 'Save Question');

    expect(emitSpy).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent as string).toContain('Please add at least 3 rows.');
  });

  it('rejects duplicate option values', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance;
    const emitSpy = vi.spyOn(component.save, 'emit');

    const optionInputs = Array.from(
      fixture.nativeElement.querySelectorAll('input[type="number"]'),
    ) as HTMLInputElement[];
    setInputValue(optionInputs[3], '3');
    setInputValue(optionInputs[4], '3');

    clickButton(fixture, 'Save Question');

    expect(emitSpy).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent as string).toContain('Option values must be unique.');
  });

  it('rejects missing correct option', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance;
    const emitSpy = vi.spyOn(component.save, 'emit');

    component.selectedCorrectOptionId = null;
    fixture.detectChanges();

    clickButton(fixture, 'Save Question');

    expect(emitSpy).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent as string).toContain('Select one correct answer.');
  });

  it('rejects incorrect arithmetic answer', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance;
    const emitSpy = vi.spyOn(component.save, 'emit');

    const numberInputs = Array.from(
      fixture.nativeElement.querySelectorAll('input[type="number"]'),
    ) as HTMLInputElement[];
    setInputValue(numberInputs[0], '3');
    setInputValue(numberInputs[1], '2');
    setInputValue(numberInputs[2], '4');
    setInputValue(numberInputs[3], '4');
    setInputValue(numberInputs[4], '7');
    setInputValue(numberInputs[5], '8');
    setInputValue(numberInputs[6], '8');

    const radios = Array.from(
      fixture.nativeElement.querySelectorAll('input[type="radio"]'),
    ) as HTMLInputElement[];
    radios[3].click();
    fixture.detectChanges();

    clickButton(fixture, 'Save Question');

    expect(emitSpy).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent as string).toContain(
      'The correct answer must match the arithmetic result.',
    );
  });

  it('supports optional subtraction on later rows', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance;
    const emitSpy = vi.spyOn(component.save, 'emit');

    const numberInputs = Array.from(
      fixture.nativeElement.querySelectorAll('input[type="number"]'),
    ) as HTMLInputElement[];
    setInputValue(numberInputs[0], '5');
    setInputValue(numberInputs[1], '2');
    setInputValue(numberInputs[2], '1');
    setInputValue(numberInputs[3], '2');
    setInputValue(numberInputs[4], '3');
    setInputValue(numberInputs[5], '4');
    setInputValue(numberInputs[6], '5');

    const operatorSelects = Array.from(
      fixture.nativeElement.querySelectorAll('[data-testid="row-operator"]'),
    ) as HTMLSelectElement[];

    if (operatorSelects.length === 0) {
      throw new Error('Expected operator select to exist');
    }

    operatorSelects[0].value = '-';
    operatorSelects[0].dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    const radios = Array.from(
      fixture.nativeElement.querySelectorAll('input[type="radio"]'),
    ) as HTMLInputElement[];
    radios[2].click();
    fixture.detectChanges();

    clickButton(fixture, 'Save Question');

    const emittedQuestion = getEmittedQuestion(emitSpy);
    expect(emittedQuestion.rows[1]).toEqual({ value: 2, operator: '-' });
  });

  it('rejects subtraction operator on first row', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance;
    const emitSpy = vi.spyOn(component.save, 'emit');

    component.rows[0].operator = '-';
    fixture.detectChanges();

    clickButton(fixture, 'Save Question');

    expect(emitSpy).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent as string).toContain(
      'The first row cannot use a subtraction operator.',
    );
  });

  it('emits cancel on Cancel', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance;
    const emitSpy = vi.spyOn(component.cancel, 'emit');

    clickButton(fixture, 'Cancel');

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('renders Edit Question in edit mode and loads the existing question', () => {
    const editQuestion = createEditQuestion();
    const fixture = createFixture(editQuestion);

    expect(fixture.nativeElement.textContent as string).toContain('Edit Question');
    expect(fixture.nativeElement.textContent as string).toContain('Row 1 value');
    expect(fixture.nativeElement.textContent as string).toContain('Row 2 value');
    expect(fixture.nativeElement.textContent as string).toContain('Row 3 value');
    expect(fixture.nativeElement.textContent as string).toContain('Option 1');
    expect(fixture.nativeElement.textContent as string).toContain('Option 2');
    expect(fixture.nativeElement.textContent as string).toContain('Option 3');
    expect(fixture.nativeElement.textContent as string).toContain('Option 4');
    const component = fixture.componentInstance;

    expect(component.rows).toEqual([
      { value: 3, operator: '' },
      { value: 2, operator: '' },
      { value: 4, operator: '' },
    ]);
    expect(component.options).toEqual([
      { id: 'opt-1', value: 4 },
      { id: 'opt-2', value: 7 },
      { id: 'opt-3', value: 8 },
      { id: 'opt-4', value: 9 },
    ]);
    expect(component.selectedCorrectOptionId).toBe('opt-4');
    expect(component.difficulty).toBe('EASY');
    expect(component.explanation).toBe('3 + 2 + 4 = 9');
  });

  it('does not mutate the input question when editing', () => {
    const editQuestion = createEditQuestion();
    const originalSnapshot = JSON.parse(JSON.stringify(editQuestion)) as Question;
    const fixture = createFixture(editQuestion);
    const component = fixture.componentInstance;

    component.rows[0].value = 9;
    component.options[0].value = 1;
    component.selectedCorrectOptionId = 'opt-2';
    fixture.detectChanges();

    expect(editQuestion).toEqual(originalSnapshot);
  });

  it('preserves the original question id and createdAt when editing', () => {
    const editQuestion = createEditQuestion();
    const fixture = createFixture(editQuestion);
    const component = fixture.componentInstance;
    const emitSpy = vi.spyOn(component.save, 'emit');

    const rowInputs = Array.from(
      fixture.nativeElement.querySelectorAll('input[type="number"]'),
    ) as HTMLInputElement[];
    setInputValue(rowInputs[2], '3');

    const radios = Array.from(
      fixture.nativeElement.querySelectorAll('input[type="radio"]'),
    ) as HTMLInputElement[];
    radios[2].click();
    fixture.detectChanges();

    clickButton(fixture, 'Save Question');

    const emittedQuestion = getEmittedQuestion(emitSpy);

    expect(emittedQuestion.id).toBe('question-edit-1');
    expect(emittedQuestion.createdAt).toBe('2026-09-19T10:00:00Z');
    expect(emittedQuestion.rows).toEqual([{ value: 3 }, { value: 2 }, { value: 3 }]);
    expect(emittedQuestion.correctOptionId).toBe('opt-3');
  });

  it('preserves option IDs when editing option values', () => {
    const editQuestion = createEditQuestion();
    const fixture = createFixture(editQuestion);
    const component = fixture.componentInstance;
    const emitSpy = vi.spyOn(component.save, 'emit');

    const inputs = Array.from(
      fixture.nativeElement.querySelectorAll('input[type="number"]'),
    ) as HTMLInputElement[];
    setInputValue(inputs[4], '10');

    clickButton(fixture, 'Save Question');

    const emittedQuestion = getEmittedQuestion(emitSpy);

    expect(emittedQuestion.options[1]).toEqual({ id: 'opt-2', value: 10 });
  });

  it('updates difficulty when editing', () => {
    const editQuestion = createEditQuestion();
    const fixture = createFixture(editQuestion);
    const component = fixture.componentInstance;
    const emitSpy = vi.spyOn(component.save, 'emit');

    component.difficulty = 'MEDIUM';
    fixture.detectChanges();

    clickButton(fixture, 'Save Question');

    const emittedQuestion = getEmittedQuestion(emitSpy);

    expect(emittedQuestion.difficulty).toBe('MEDIUM');
  });

  it('updates explanation when editing', () => {
    const editQuestion = createEditQuestion();
    const fixture = createFixture(editQuestion);
    const component = fixture.componentInstance;
    const emitSpy = vi.spyOn(component.save, 'emit');

    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    setInputValue(textarea, 'Updated explanation');

    clickButton(fixture, 'Save Question');

    const emittedQuestion = getEmittedQuestion(emitSpy);

    expect(emittedQuestion.explanation).toBe('Updated explanation');
  });

  it('validates edit mode', () => {
    const editQuestion = createEditQuestion();
    const fixture = createFixture(editQuestion);
    const component = fixture.componentInstance;
    const emitSpy = vi.spyOn(component.save, 'emit');

    const optionInputs = Array.from(
      fixture.nativeElement.querySelectorAll('input[type="number"]'),
    ) as HTMLInputElement[];
    setInputValue(optionInputs[3], '4');
    setInputValue(optionInputs[4], '4');

    clickButton(fixture, 'Save Question');

    expect(emitSpy).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent as string).toContain('Option values must be unique.');
  });

  it('emits cancel in edit mode', () => {
    const editQuestion = createEditQuestion();
    const fixture = createFixture(editQuestion);
    const component = fixture.componentInstance;
    const emitSpy = vi.spyOn(component.cancel, 'emit');

    clickButton(fixture, 'Cancel');

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });
});
