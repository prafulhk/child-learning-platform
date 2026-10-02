import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import type { AssessmentAttempt } from '../../core/models/assessment.model';
import { LocalStorageService } from '../../core/services/local-storage.service';

import { AssessmentResultComponent } from './assessment-result.component';

describe('AssessmentResultComponent', () => {
  let fixture: ComponentFixture<AssessmentResultComponent>;
  let component: AssessmentResultComponent;
  let router: { navigate: ReturnType<typeof vi.fn> };

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

    router = { navigate: vi.fn().mockResolvedValue(true) };

    await TestBed.configureTestingModule({
      imports: [AssessmentResultComponent],
      providers: [
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: vi.fn().mockReturnValue('client-1'),
              },
            },
          },
        },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
      ],
    }).compileComponents();

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
