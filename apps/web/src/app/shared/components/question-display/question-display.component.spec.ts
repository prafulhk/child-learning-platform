import { TestBed } from '@angular/core/testing';
import { SimpleArithmeticQuestion } from '../../../core/models/question.model';
import { QuestionDisplayComponent } from './question-display.component';

describe('QuestionDisplayComponent', () => {
  const baseQuestion: SimpleArithmeticQuestion = {
    id: 'q-test',
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'EASY',
    rows: [{ value: 8 }, { value: 3, operator: '-' }, { value: 2 }],
    options: [
      { id: 'a', value: 6 },
      { id: 'b', value: 7 },
      { id: 'c', value: 8 },
      { id: 'd', value: 9 },
    ],
    correctOptionId: 'b',
    explanation: '8 - 3 + 2 = 7',
    createdAt: '2026-09-19T00:00:00Z',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionDisplayComponent],
    }).compileComponents();
  });

  it('renders all arithmetic rows dynamically', () => {
    const fixture = TestBed.createComponent(QuestionDisplayComponent);
    fixture.componentInstance.question = baseQuestion;
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('.row:not(.answer-row)');
    expect(rows.length).toBe(3);
  });

  it('shows minus sign only when operator is minus', () => {
    const fixture = TestBed.createComponent(QuestionDisplayComponent);
    fixture.componentInstance.question = baseQuestion;
    fixture.detectChanges();

    const operatorEls = fixture.nativeElement.querySelectorAll('.row:not(.answer-row) .operator');
    expect((operatorEls[0] as HTMLElement).textContent?.trim()).toBe('');
    expect((operatorEls[1] as HTMLElement).textContent?.trim()).toBe('-');
    expect((operatorEls[2] as HTMLElement).textContent?.trim()).toBe('');
  });

  it('supports more than two rows', () => {
    const fixture = TestBed.createComponent(QuestionDisplayComponent);
    fixture.componentInstance.question = {
      ...baseQuestion,
      rows: [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }],
    };
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('.row:not(.answer-row)');
    expect(rows.length).toBe(4);
  });
});
