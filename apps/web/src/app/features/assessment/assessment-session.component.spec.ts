import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import type {
  ActiveAssessmentSession,
  AssessmentQuestionSnapshot,
} from '../../core/models/assessment.model';
import { AssessmentService } from '../../core/services/assessment.service';
import { AttemptsApiService } from '../../core/services/attempts-api.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { QuestionService } from '../../core/services/question.service';

import { AssessmentSessionComponent } from './assessment-session.component';

describe('AssessmentSessionComponent', () => {
  let fixture: ComponentFixture<AssessmentSessionComponent>;
  let component: AssessmentSessionComponent;

  const question = (id: string, correctOptionId = `${id}-b`): AssessmentQuestionSnapshot => ({
    questionId: id,
    questionSnapshot: {
      id,
      type: 'SIMPLE_ARITHMETIC',
      subjectId: 'abacus',
      topicId: 'single-digit-addition',
      difficulty: 'EASY',
      rows: [{ value: 2 }, { value: 3 }, { value: 1 }],
      options: [
        { id: `${id}-a`, value: 5 },
        { id: `${id}-b`, value: 6 },
        { id: `${id}-c`, value: 7 },
      ],
      correctOptionId,
      createdAt: '2026-09-20T00:00:00.000Z',
    },
  });

  const assessmentServiceMock = {
    createSession: vi.fn(),
  };

  const questionServiceMock = {
    getQuestionsByTopic: vi.fn(),
  };

  const localStorageServiceMock = {
    saveCompletedAssessmentAttempt: vi.fn(),
  };

  const attemptsApiServiceMock = {
    saveAttempt: vi.fn(),
  };

  const createSession = (): ActiveAssessmentSession => ({
    assessmentId: 'olympiad-test',
    startedAt: new Date().toISOString(),
    endsAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    currentQuestionIndex: 0,
    questions: [question('q1'), question('q2'), question('q3')],
    selectedAnswers: {},
    flaggedQuestionIds: [],
  });

  beforeEach(async () => {
    vi.useRealTimers();
    vi.clearAllMocks();

    questionServiceMock.getQuestionsByTopic.mockReturnValue([
      question('q1').questionSnapshot,
      question('q2').questionSnapshot,
      question('q3').questionSnapshot,
    ]);
    assessmentServiceMock.createSession.mockImplementation(() => createSession());
    attemptsApiServiceMock.saveAttempt.mockReturnValue(of({ message: 'saved', attempt: {} }));

    await TestBed.configureTestingModule({
      imports: [AssessmentSessionComponent],
      providers: [
        provideRouter([]),
        { provide: AssessmentService, useValue: assessmentServiceMock },
        { provide: QuestionService, useValue: questionServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: AttemptsApiService, useValue: attemptsApiServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AssessmentSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('creates the routed assessment session', () => {
    expect(component).toBeTruthy();
    expect(component.activeAssessmentSession).not.toBeNull();
    expect(component.questionNumber).toBe(1);
    expect(component.totalQuestions).toBe(3);
  });

  it('renders the current question and answer options', () => {
    expect(fixture.nativeElement.textContent).toContain('Question: 1');
    expect(fixture.nativeElement.querySelectorAll('app-answer-option')).toHaveLength(3);
  });

  it('selects an answer and advances to the next question', () => {
    component.onOptionSelected('q1-b');

    expect(component.selectedOptionId).toBe('q1-b');

    vi.runAllTimers();

    expect(component.questionNumber).toBe(2);
  });

  it('clears the current answer', () => {
    component.onOptionSelected('q1-b');
    expect(component.selectedOptionId).toBe('q1-b');

    component.onPrevious();
    component.onClear();

    expect(component.selectedOptionId).toBeNull();
  });

  it('toggles the current question flag', () => {
    expect(component.flagged).toBe(false);

    component.onFlag();
    expect(component.flagged).toBe(true);

    component.onFlag();
    expect(component.flagged).toBe(false);
  });

  it('navigates using the question palette', () => {
    component.onQuestionNavigate(2);

    expect(component.questionNumber).toBe(3);
    expect(component.questionPalette[2].answered).toBe(false);
  });

  it('completes the assessment on submit and persists the attempt', async () => {
    component.onSubmitAssessment();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(localStorageServiceMock.saveCompletedAssessmentAttempt).toHaveBeenCalledTimes(1);
    expect(attemptsApiServiceMock.saveAttempt).toHaveBeenCalledTimes(1);
    expect(component.activeAssessmentSession).toBeNull();
  });

  it('completes the assessment when the timer expires', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-20T10:00:00.000Z'));

    const session = createSession();
    session.startedAt = '2026-09-20T10:00:00.000Z';
    session.endsAt = '2026-09-20T10:15:00.000Z';
    assessmentServiceMock.createSession.mockReturnValueOnce(session);

    fixture.destroy();
    fixture = TestBed.createComponent(AssessmentSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    vi.advanceTimersByTime(15 * 60 * 1000 + 1000);
    fixture.detectChanges();

    expect(localStorageServiceMock.saveCompletedAssessmentAttempt).toHaveBeenCalledTimes(1);
    expect(component.activeAssessmentSession).toBeNull();
  });
});
