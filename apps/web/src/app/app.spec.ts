import { TestBed } from '@angular/core/testing';

import { App } from './app';
import { AssessmentService } from './core/services/assessment.service';
import { LocalStorageService } from './core/services/local-storage.service';
import { QuestionService } from './core/services/question.service';

describe('App assessment timer', () => {
  let visibilityState: DocumentVisibilityState;

  const localStorageServiceMock = {
    saveCompletedAssessmentAttempt: vi.fn(),
  };

  const setVisibilityState = (state: DocumentVisibilityState): void => {
    visibilityState = state;
  };

  beforeEach(async () => {
    visibilityState = 'visible';
    localStorageServiceMock.saveCompletedAssessmentAttempt.mockReset();

    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => visibilityState,
    });

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        AssessmentService,
        QuestionService,
        {
          provide: LocalStorageService,
          useValue: localStorageServiceMock,
        },
      ],
    }).compileComponents();
  });

  afterEach(() => {
    vi.useRealTimers();
    setVisibilityState('visible');
  });

  it('completes the assessment when the page becomes visible after expiry', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-20T10:00:00.000Z'));

    const fixture = TestBed.createComponent(App);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    component.onOpenAssessment();
    component.onStartAssessment();

    expect(component.view).toBe('ASSESSMENT_SESSION');

    setVisibilityState('hidden');
    component.onVisibilityChange();

    vi.advanceTimersByTime(component.olympiadDefinition.config.durationSeconds * 1000 + 1000);

    setVisibilityState('visible');
    component.onVisibilityChange();
    fixture.detectChanges();

    expect(component.view).toBe('ASSESSMENT_RESULT');
    expect(component.completedAssessmentAttempt).not.toBeNull();
    expect(localStorageServiceMock.saveCompletedAssessmentAttempt).toHaveBeenCalledTimes(1);
  });

  it('prevents duplicate saves after automatic completion', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-20T10:00:00.000Z'));

    const fixture = TestBed.createComponent(App);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    component.onOpenAssessment();
    component.onStartAssessment();

    vi.advanceTimersByTime(component.olympiadDefinition.config.durationSeconds * 1000 + 1000);
    fixture.detectChanges();

    expect(component.view).toBe('ASSESSMENT_RESULT');
    expect(localStorageServiceMock.saveCompletedAssessmentAttempt).toHaveBeenCalledTimes(1);

    component.onSubmitAssessment();

    expect(localStorageServiceMock.saveCompletedAssessmentAttempt).toHaveBeenCalledTimes(1);
  });
});
