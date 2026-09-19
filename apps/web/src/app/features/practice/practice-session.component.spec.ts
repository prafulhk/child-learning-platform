import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Question } from '../../core/models/question.model';
import {
  ActivePracticeSession,
  PracticeAttempt,
  PresentedQuestionSnapshot,
} from '../../core/services/local-storage.service';
import { PracticeService } from '../../core/services/practice.service';
import { PracticeSessionComponent } from './practice-session.component';

function makeQuestion(id: string): Question {
  return {
    id,
    type: 'SIMPLE_ARITHMETIC',
    subjectId: 'abacus',
    topicId: 'single-digit-addition',
    difficulty: 'EASY',
    rows: [{ value: 1 }, { value: 1 }],
    options: [
      { id: `${id}-a`, value: 1 },
      { id: `${id}-b`, value: 2 },
      { id: `${id}-c`, value: 3 },
      { id: `${id}-d`, value: 4 },
    ],
    correctOptionId: `${id}-b`,
    explanation: '1 + 1 = 2',
    createdAt: '2026-09-19T00:00:00Z',
  };
}

function makeSession(): ActivePracticeSession {
  const startedAt = new Date().toISOString();
  const endsAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  const presentedQuestions: PresentedQuestionSnapshot[] = Array.from({ length: 10 }).map(
    (_, idx) => {
      const qid = `q${idx + 1}`;

      return {
        questionId: qid,
        questionSnapshot: makeQuestion(qid),
      };
    },
  );

  return {
    topicId: 'single-digit-addition',
    startedAt,
    endsAt,
    currentQuestionIndex: 0,
    presentedQuestions,
    selectedAnswers: {},
  };
}

function refreshFixture(fixture: ComponentFixture<PracticeSessionComponent>): void {
  fixture.changeDetectorRef.markForCheck();
  fixture.detectChanges();
}

describe('PracticeSessionComponent', () => {
  let session: ActivePracticeSession;
  let completedAttempt: PracticeAttempt;

  const practiceServiceMock = {
    startPractice: vi.fn(),
    getSession: vi.fn(),
    getRemainingSeconds: vi.fn(),
    isSessionExpired: vi.fn(),
    recordAnswer: vi.fn(),
    goToPrevious: vi.fn(),
    completePractice: vi.fn(),
  };

  beforeEach(async () => {
    session = makeSession();

    completedAttempt = {
      id: 'attempt-1',
      topicId: 'single-digit-addition',
      startedAt: session.startedAt,
      completedAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      presentedQuestions: JSON.parse(JSON.stringify(session.presentedQuestions)),
      selectedAnswers: {},
      result: {
        totalQuestions: 10,
        correctCount: 8,
        incorrectCount: 2,
        unansweredCount: 0,
        accuracyPercentage: 80,
      },
    };

    practiceServiceMock.startPractice.mockImplementation(() => JSON.parse(JSON.stringify(session)));

    practiceServiceMock.getSession
      .mockImplementationOnce(() => null)
      .mockImplementation(() => JSON.parse(JSON.stringify(session)));

    practiceServiceMock.getRemainingSeconds.mockImplementation(
      (currentSession: ActivePracticeSession | null) => {
        if (!currentSession) {
          return 0;
        }

        return Math.max(
          0,
          Math.floor((new Date(currentSession.endsAt).getTime() - Date.now()) / 1000),
        );
      },
    );

    practiceServiceMock.isSessionExpired.mockImplementation(
      (currentSession: ActivePracticeSession | null) =>
        practiceServiceMock.getRemainingSeconds(currentSession) === 0,
    );

    practiceServiceMock.recordAnswer.mockImplementation(
      (questionId: string, selectedOptionId: string) => {
        session.selectedAnswers[questionId] = selectedOptionId;

        if (session.currentQuestionIndex < session.presentedQuestions.length - 1) {
          session.currentQuestionIndex += 1;
        }
      },
    );

    practiceServiceMock.goToPrevious.mockImplementation(() => {
      if (session.currentQuestionIndex > 0) {
        session.currentQuestionIndex -= 1;
      }

      return session.presentedQuestions[session.currentQuestionIndex] ?? null;
    });

    practiceServiceMock.completePractice.mockImplementation(() => completedAttempt);

    await TestBed.configureTestingModule({
      imports: [PracticeSessionComponent],
      providers: [
        {
          provide: PracticeService,
          useValue: practiceServiceMock,
        },
      ],
    }).compileComponents();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('component starts a practice session', () => {
    const fixture = TestBed.createComponent(PracticeSessionComponent);

    refreshFixture(fixture);

    expect(practiceServiceMock.startPractice).toHaveBeenCalledWith('single-digit-addition');
  });

  it('displays question 1 of 10', () => {
    const fixture = TestBed.createComponent(PracticeSessionComponent);

    refreshFixture(fixture);

    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Question 1 of 10');
  });

  it('displays four answer options', () => {
    const fixture = TestBed.createComponent(PracticeSessionComponent);

    refreshFixture(fixture);

    const options = fixture.nativeElement.querySelectorAll('app-answer-option');

    expect(options.length).toBe(4);
  });

  it('displays the countdown timer', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-19T00:00:00Z'));

    session = makeSession();
    practiceServiceMock.startPractice.mockImplementation(() => JSON.parse(JSON.stringify(session)));
    practiceServiceMock.getSession
      .mockImplementationOnce(() => null)
      .mockImplementation(() => JSON.parse(JSON.stringify(session)));

    const fixture = TestBed.createComponent(PracticeSessionComponent);

    refreshFixture(fixture);

    expect(fixture.nativeElement.textContent as string).toContain('05:00');
  });

  it('selecting an option calls PracticeService.recordAnswer()', () => {
    const fixture = TestBed.createComponent(PracticeSessionComponent);

    refreshFixture(fixture);

    const component = fixture.componentInstance;
    const current = component.currentPresentedQuestion;

    if (!current) {
      throw new Error('Expected current question to exist');
    }

    const selectedOptionId = current.questionSnapshot.options[0].id;

    component.onSelectOption(selectedOptionId);

    expect(practiceServiceMock.recordAnswer).toHaveBeenCalledWith(
      current.questionId,
      selectedOptionId,
    );
  });

  it('selecting an option advances to the next question', () => {
    const fixture = TestBed.createComponent(PracticeSessionComponent);

    refreshFixture(fixture);

    const component = fixture.componentInstance;
    const current = component.currentPresentedQuestion;

    if (!current) {
      throw new Error('Expected current question to exist');
    }

    component.onSelectOption(current.questionSnapshot.options[0].id);

    expect(component.currentQuestionIndex).toBe(1);

    refreshFixture(fixture);

    expect(fixture.nativeElement.textContent as string).toContain('Question 2 of 10');
  });

  it('Previous is unavailable on question 1', () => {
    const fixture = TestBed.createComponent(PracticeSessionComponent);

    refreshFixture(fixture);

    const host = fixture.nativeElement as HTMLElement;

    const previousBtn = Array.from(host.querySelectorAll<HTMLButtonElement>('button')).find(
      (btn) => btn.textContent?.trim() === 'Previous',
    );

    expect(previousBtn).toBeDefined();

    if (!previousBtn) {
      throw new Error('Expected Previous button to be rendered');
    }

    expect(previousBtn.disabled).toBe(true);
  });

  it('Previous moves to the previous question', () => {
    const fixture = TestBed.createComponent(PracticeSessionComponent);

    refreshFixture(fixture);

    const component = fixture.componentInstance;
    const current = component.currentPresentedQuestion;

    if (!current) {
      throw new Error('Expected current question to exist');
    }

    component.onSelectOption(current.questionSnapshot.options[0].id);

    expect(component.currentQuestionIndex).toBe(1);

    refreshFixture(fixture);

    component.onPrevious();

    expect(component.currentQuestionIndex).toBe(0);

    expect(practiceServiceMock.goToPrevious).toHaveBeenCalled();

    refreshFixture(fixture);

    expect(fixture.nativeElement.textContent as string).toContain('Question 1 of 10');
  });

  it('Previous does not reset the timer', () => {
    const fixture = TestBed.createComponent(PracticeSessionComponent);

    refreshFixture(fixture);

    const component = fixture.componentInstance;
    const startingTime = component.remainingSeconds;
    const current = component.currentPresentedQuestion;

    if (!current) {
      throw new Error('Expected current question to exist');
    }

    component.onSelectOption(current.questionSnapshot.options[0].id);
    component.onPrevious();

    expect(component.remainingSeconds).toBe(startingTime);
  });

  it('previous question preserves selected answer', () => {
    const fixture = TestBed.createComponent(PracticeSessionComponent);

    refreshFixture(fixture);

    const component = fixture.componentInstance;

    const q1 = component.currentPresentedQuestion;

    if (!q1) {
      throw new Error('Expected question 1');
    }

    const q1Selected = q1.questionSnapshot.options[1].id;

    component.onSelectOption(q1Selected);

    refreshFixture(fixture);

    expect(component.currentQuestionIndex).toBe(1);

    component.onPrevious();

    refreshFixture(fixture);

    expect(component.currentQuestionIndex).toBe(0);

    expect(component.selectedOptionIdForCurrentQuestion).toBe(q1Selected);
  });

  it('question progress displays correctly', () => {
    const fixture = TestBed.createComponent(PracticeSessionComponent);

    refreshFixture(fixture);

    const component = fixture.componentInstance;

    const q1 = component.currentPresentedQuestion;

    if (!q1) {
      throw new Error('Expected question 1');
    }

    component.onSelectOption(q1.questionSnapshot.options[0].id);

    expect(component.currentQuestionIndex).toBe(1);

    refreshFixture(fixture);

    expect(fixture.nativeElement.textContent as string).toContain('Question 2 of 10');

    const q2 = component.currentPresentedQuestion;

    if (!q2) {
      throw new Error('Expected question 2');
    }

    component.onSelectOption(q2.questionSnapshot.options[0].id);

    expect(component.currentQuestionIndex).toBe(2);

    refreshFixture(fixture);

    expect(fixture.nativeElement.textContent as string).toContain('Question 3 of 10');
  });

  it('answering question 10 enters completed state', () => {
    const fixture = TestBed.createComponent(PracticeSessionComponent);

    refreshFixture(fixture);

    const component = fixture.componentInstance;

    for (let i = 0; i < 9; i += 1) {
      const current = component.currentPresentedQuestion;

      if (!current) {
        throw new Error(`Expected question at step ${i + 1}`);
      }

      component.onSelectOption(current.questionSnapshot.options[0].id);

      expect(component.currentQuestionIndex).toBe(i + 1);

      refreshFixture(fixture);
    }

    const q10 = component.currentPresentedQuestion;

    if (!q10) {
      throw new Error('Expected question 10');
    }

    expect(component.currentQuestionIndex).toBe(9);

    component.onSelectOption(q10.questionSnapshot.options[0].id);

    refreshFixture(fixture);

    expect(component.completed).toBe(true);

    expect(practiceServiceMock.completePractice).toHaveBeenCalled();

    expect(fixture.nativeElement.textContent as string).toContain('Practice completed.');
  });

  it('timeout completes the practice', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-19T00:00:00Z'));

    session = makeSession();
    session.endsAt = new Date(Date.now() + 1000).toISOString();

    practiceServiceMock.startPractice.mockImplementation(() => JSON.parse(JSON.stringify(session)));
    practiceServiceMock.getSession
      .mockImplementationOnce(() => null)
      .mockImplementation(() => JSON.parse(JSON.stringify(session)));

    const fixture = TestBed.createComponent(PracticeSessionComponent);

    refreshFixture(fixture);

    vi.advanceTimersByTime(1000);
    fixture.detectChanges();

    expect(practiceServiceMock.completePractice).toHaveBeenCalled();
    expect(fixture.componentInstance.completed).toBe(true);
    expect(fixture.nativeElement.textContent as string).toContain('Practice completed.');
  });

  it('expired persisted session is handled correctly', () => {
    const expiredSession = makeSession();
    expiredSession.endsAt = new Date(Date.now() - 1000).toISOString();

    practiceServiceMock.getSession.mockReset();
    practiceServiceMock.getSession.mockImplementation(() =>
      JSON.parse(JSON.stringify(expiredSession)),
    );
    practiceServiceMock.isSessionExpired.mockImplementation(() => true);

    const fixture = TestBed.createComponent(PracticeSessionComponent);

    refreshFixture(fixture);

    expect(practiceServiceMock.startPractice).not.toHaveBeenCalled();
    expect(practiceServiceMock.completePractice).toHaveBeenCalled();
    expect(fixture.componentInstance.completed).toBe(true);
    expect(fixture.nativeElement.textContent as string).toContain('Practice completed.');
  });

  it('cleans up the countdown timer when destroyed', () => {
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
    const fixture = TestBed.createComponent(PracticeSessionComponent);

    refreshFixture(fixture);

    fixture.destroy();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it('shows no immediate correctness feedback after answer selection', () => {
    const fixture = TestBed.createComponent(PracticeSessionComponent);

    refreshFixture(fixture);

    const component = fixture.componentInstance;

    const q1 = component.currentPresentedQuestion;

    if (!q1) {
      throw new Error('Expected question 1');
    }

    component.onSelectOption(q1.questionSnapshot.options[0].id);

    refreshFixture(fixture);

    const text = fixture.nativeElement.textContent as string;

    expect(text).not.toContain('Correct');
    expect(text).not.toContain('Incorrect');
  });
});
