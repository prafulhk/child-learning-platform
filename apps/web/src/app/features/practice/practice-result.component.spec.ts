import { TestBed } from '@angular/core/testing';
import { PracticeAttempt } from '../../core/services/local-storage.service';
import { PracticeResultComponent } from './practice-result.component';

describe('PracticeResultComponent', () => {
  const attempt: PracticeAttempt = {
    id: 'attempt-1',
    topicId: 'single-digit-addition',
    startedAt: '2026-09-19T00:00:00Z',
    completedAt: '2026-09-19T00:05:00Z',
    presentedQuestions: [],
    selectedAnswers: {},
    result: {
      totalQuestions: 10,
      correctCount: 8,
      incorrectCount: 1,
      unansweredCount: 1,
      accuracyPercentage: 80,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticeResultComponent],
    }).compileComponents();
  });

  it('renders completion title', () => {
    const fixture = TestBed.createComponent(PracticeResultComponent);
    fixture.componentInstance.attempt = attempt;
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent as string).toContain('Practice Completed');
  });

  it('renders accuracy', () => {
    const fixture = TestBed.createComponent(PracticeResultComponent);
    fixture.componentInstance.attempt = attempt;
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent as string).toContain('80%');
  });

  it('renders total count', () => {
    const fixture = TestBed.createComponent(PracticeResultComponent);
    fixture.componentInstance.attempt = attempt;
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent as string).toContain('Total Questions');
    expect(fixture.nativeElement.textContent as string).toContain('10');
  });

  it('renders correct count', () => {
    const fixture = TestBed.createComponent(PracticeResultComponent);
    fixture.componentInstance.attempt = attempt;
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent as string).toContain('Correct');
    expect(fixture.nativeElement.textContent as string).toContain('8');
  });

  it('renders incorrect count', () => {
    const fixture = TestBed.createComponent(PracticeResultComponent);
    fixture.componentInstance.attempt = attempt;
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent as string).toContain('Incorrect');
    expect(fixture.nativeElement.textContent as string).toContain('1');
  });

  it('renders unanswered count', () => {
    const fixture = TestBed.createComponent(PracticeResultComponent);
    fixture.componentInstance.attempt = attempt;
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent as string).toContain('Unanswered');
    expect(fixture.nativeElement.textContent as string).toContain('1');
  });

  it('emits restart when Practice Again is clicked', () => {
    const fixture = TestBed.createComponent(PracticeResultComponent);
    fixture.componentInstance.attempt = attempt;
    fixture.detectChanges();

    const emitSpy = vi.spyOn(fixture.componentInstance.restart, 'emit');
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    button.click();

    expect(emitSpy).toHaveBeenCalledWith();
  });
});
