import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import type { AssessmentAttempt } from '../../core/models/assessment.model';
import { LocalStorageService } from '../../core/services/local-storage.service';

import { AssessmentResultComponent } from './assessment-result.component';

describe('AssessmentResultComponent', () => {
  let fixture: ComponentFixture<AssessmentResultComponent>;
  let component: AssessmentResultComponent;
  let router: Router;

  const attempt: AssessmentAttempt = {
    id: 'client-1',
    assessmentId: 'olympiad-test',
    startedAt: '2026-09-27T10:38:39.000Z',
    completedAt: '2026-09-27T10:53:39.000Z',
    questions: [],
    selectedAnswers: {},
    flaggedQuestionIds: [],
    result: {
      totalQuestions: 100,
      correctCount: 80,
      incorrectCount: 15,
      unansweredCount: 5,
      accuracyPercentage: 80,
    },
  };

  const localStorageServiceMock = {
    getCompletedAssessmentAttemptById: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    localStorageServiceMock.getCompletedAssessmentAttemptById.mockReturnValue(attempt);

    await TestBed.configureTestingModule({
      imports: [AssessmentResultComponent],
      providers: [
        provideRouter([
          {
            path: 'assessment/result/:attemptId',
            component: AssessmentResultComponent,
          },
        ]),
        { provide: LocalStorageService, useValue: localStorageServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    await router.navigate(['/assessment/result', attempt.id]);

    fixture = TestBed.createComponent(AssessmentResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loads the completed assessment from local persistence', () => {
    expect(component.attempt).toEqual(attempt);
    expect(localStorageServiceMock.getCompletedAssessmentAttemptById).toHaveBeenCalledWith(
      'client-1',
    );
  });

  it('renders the assessment result', () => {
    expect(fixture.nativeElement.textContent).toContain('80%');
    expect(fixture.nativeElement.textContent).toContain('80');
    expect(fixture.nativeElement.textContent).toContain('15');
    expect(fixture.nativeElement.textContent).toContain('5');
  });

  it('navigates back to assessment home', () => {
    component.onBackToAssessment();

    expect(router.navigate).toHaveBeenCalledWith(['/assessment']);
  });

  it('navigates to assessment history', () => {
    component.onViewHistory();

    expect(router.navigate).toHaveBeenCalledWith(['/assessment/history']);
  });
});
