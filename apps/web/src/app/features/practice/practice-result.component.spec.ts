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

  // =====================================================
  // BASIC CREATION
  // =====================================================

  it('creates the component', () => {
    const fixture = TestBed.createComponent(PracticeResultComponent);

    fixture.componentRef.setInput('attempt', attempt);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });

  // =====================================================
  // HEADER
  // =====================================================

  it('renders the default completion title', () => {
    const fixture = TestBed.createComponent(PracticeResultComponent);

    fixture.componentRef.setInput('attempt', attempt);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Assessment Completed');
    expect(text).toContain('Practice Completed');
  });

  it('renders a custom title when provided', () => {
    const fixture = TestBed.createComponent(PracticeResultComponent);

    fixture.componentRef.setInput('attempt', attempt);
    fixture.componentRef.setInput('title', 'Practice Assessment Completed');

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent as string).toContain('Practice Assessment Completed');
  });

  // =====================================================
  // ACCURACY
  // =====================================================

  it('renders accuracy percentage', () => {
    const fixture = TestBed.createComponent(PracticeResultComponent);

    fixture.componentRef.setInput('attempt', attempt);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent as string).toContain('80%');
  });

  // =====================================================
  // PERFORMANCE SUMMARY
  // =====================================================

  it('renders total question count', () => {
    const fixture = TestBed.createComponent(PracticeResultComponent);

    fixture.componentRef.setInput('attempt', attempt);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Total');
    expect(text).toContain('10');
    expect(text).toContain('Questions');
  });

  it('renders correct count', () => {
    const fixture = TestBed.createComponent(PracticeResultComponent);

    fixture.componentRef.setInput('attempt', attempt);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Correct');
    expect(text).toContain('8');
  });

  it('renders incorrect count', () => {
    const fixture = TestBed.createComponent(PracticeResultComponent);

    fixture.componentRef.setInput('attempt', attempt);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Incorrect');
    expect(text).toContain('1');
  });

  it('renders unanswered count', () => {
    const fixture = TestBed.createComponent(PracticeResultComponent);

    fixture.componentRef.setInput('attempt', attempt);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Unanswered');
    expect(text).toContain('1');
  });

  // =====================================================
  // ANSWER BREAKDOWN
  // =====================================================

  it('renders the answer breakdown section', () => {
    const fixture = TestBed.createComponent(PracticeResultComponent);

    fixture.componentRef.setInput('attempt', attempt);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent as string).toContain('Answer Breakdown');
  });

  it('renders performance overview section', () => {
    const fixture = TestBed.createComponent(PracticeResultComponent);

    fixture.componentRef.setInput('attempt', attempt);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Performance Overview');
    expect(text).toContain('Your Learning Summary');
  });

  // =====================================================
  // ACHIEVEMENT
  // =====================================================

  it('calculates the achievement level for 80 percent accuracy', () => {
    const fixture = TestBed.createComponent(PracticeResultComponent);

    fixture.componentRef.setInput('attempt', attempt);
    fixture.detectChanges();

    expect(fixture.componentInstance.achievementLevel).toBe(70);
  });

  it('renders the achievement message for 80 percent accuracy', () => {
    const fixture = TestBed.createComponent(PracticeResultComponent);

    fixture.componentRef.setInput('attempt', attempt);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Number Rocket Launched!');
    expect(text).toContain('Your math skills are taking off!');
  });

  // =====================================================
  // ACTION
  // =====================================================

  it('emits restart when Practice Again is clicked', () => {
    const fixture = TestBed.createComponent(PracticeResultComponent);

    fixture.componentRef.setInput('attempt', attempt);
    fixture.detectChanges();

    const emitSpy = vi.spyOn(fixture.componentInstance.restart, 'emit');

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button).toBeTruthy();

    button.click();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('emits backToHome when action type is backToHome', () => {
    const fixture = TestBed.createComponent(PracticeResultComponent);

    fixture.componentRef.setInput('attempt', attempt);
    fixture.componentRef.setInput('actionType', 'backToHome');
    fixture.componentRef.setInput('actionLabel', 'Back to Dashboard');

    fixture.detectChanges();

    const emitSpy = vi.spyOn(fixture.componentInstance.backToHome, 'emit');

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button).toBeTruthy();

    expect(fixture.nativeElement.textContent as string).toContain('Back to Dashboard');

    button.click();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  // =====================================================
  // ACTION HANDLERS
  // =====================================================

  it('calls restart handler', () => {
    const fixture = TestBed.createComponent(PracticeResultComponent);

    fixture.componentRef.setInput('attempt', attempt);
    fixture.detectChanges();

    const emitSpy = vi.spyOn(fixture.componentInstance.restart, 'emit');

    fixture.componentInstance.onRestart();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('calls backToHome handler', () => {
    const fixture = TestBed.createComponent(PracticeResultComponent);

    fixture.componentRef.setInput('attempt', attempt);
    fixture.detectChanges();

    const emitSpy = vi.spyOn(fixture.componentInstance.backToHome, 'emit');

    fixture.componentInstance.onBackToHome();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('uses restart action by default', () => {
    const fixture = TestBed.createComponent(PracticeResultComponent);

    fixture.componentRef.setInput('attempt', attempt);
    fixture.detectChanges();

    const restartSpy = vi.spyOn(fixture.componentInstance.restart, 'emit');

    const backToHomeSpy = vi.spyOn(fixture.componentInstance.backToHome, 'emit');

    fixture.componentInstance.onAction();

    expect(restartSpy).toHaveBeenCalledTimes(1);
    expect(backToHomeSpy).not.toHaveBeenCalled();
  });

  it('uses backToHome action when action type is backToHome', () => {
    const fixture = TestBed.createComponent(PracticeResultComponent);

    fixture.componentRef.setInput('attempt', attempt);
    fixture.componentRef.setInput('actionType', 'backToHome');

    fixture.detectChanges();

    const restartSpy = vi.spyOn(fixture.componentInstance.restart, 'emit');

    const backToHomeSpy = vi.spyOn(fixture.componentInstance.backToHome, 'emit');

    fixture.componentInstance.onAction();

    expect(backToHomeSpy).toHaveBeenCalledTimes(1);
    expect(restartSpy).not.toHaveBeenCalled();
  });
});
