import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { AssessmentHistoryComponent } from './assessment-history.component';
import { AttemptsApiService, type BackendAttempt } from '../../core/services/attempts-api.service';

describe('AssessmentHistoryComponent', () => {
  let component: AssessmentHistoryComponent;
  let fixture: ComponentFixture<AssessmentHistoryComponent>;
  let router: Router;

  const attemptsApiServiceMock = {
    getAttempts: vi.fn(),
  };

  const attempts: BackendAttempt[] = [
    {
      _id: 'attempt-1',
      userId: 'user-1',
      attemptType: 'ASSESSMENT',
      clientAttemptId: 'client-1',
      assessmentId: 'olympiad-test',
      title: 'Abacus Olympiad Test',
      startedAt: '2026-09-27T10:38:39.000Z',
      completedAt: '2026-09-27T10:39:04.000Z',
      result: {
        totalQuestions: 100,
        correctCount: 7,
        incorrectCount: 92,
        unansweredCount: 1,
        accuracyPercentage: 7,
      },
    },
    {
      _id: 'attempt-2',
      userId: 'user-1',
      attemptType: 'PRACTICE',
      clientAttemptId: 'client-2',
      topicId: 'single-digit-addition',
      startedAt: '2026-09-23T07:20:00.000Z',
      completedAt: '2026-09-23T07:29:00.000Z',
      result: {
        totalQuestions: 10,
        correctCount: 10,
        incorrectCount: 0,
        unansweredCount: 0,
        accuracyPercentage: 100,
      },
    },
    {
      _id: 'attempt-3',
      userId: 'user-1',
      attemptType: 'ASSESSMENT',
      clientAttemptId: 'client-3',
      assessmentId: 'olympiad-test',
      title: 'Abacus Olympiad Test',
      startedAt: '2026-09-20T10:00:00.000Z',
      completedAt: '2026-09-20T10:20:00.000Z',
      result: {
        totalQuestions: 100,
        correctCount: 80,
        incorrectCount: 20,
        unansweredCount: 0,
        accuracyPercentage: 80,
      },
    },
  ];

  beforeEach(async () => {
    vi.clearAllMocks();

    attemptsApiServiceMock.getAttempts.mockReturnValue(
      of({
        attempts,
        pagination: {
          page: 1,
          limit: 100,
          total: attempts.length,
          totalPages: 1,
        },
      }),
    );

    await TestBed.configureTestingModule({
      imports: [AssessmentHistoryComponent],
      providers: [
        provideRouter([]),
        {
          provide: AttemptsApiService,
          useValue: attemptsApiServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AssessmentHistoryComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should load attempts from the API', () => {
    fixture.detectChanges();

    expect(attemptsApiServiceMock.getAttempts).toHaveBeenCalledWith(undefined, 1, 100);
    expect(component.attempts()).toEqual(attempts);
  });

  it('should sort attempts with the newest completed attempt first', () => {
    fixture.detectChanges();

    expect(component.attempts().map((attempt) => attempt._id)).toEqual([
      'attempt-1',
      'attempt-2',
      'attempt-3',
    ]);
  });

  it('should calculate total attempts', () => {
    fixture.detectChanges();
    expect(component.totalAttempts()).toBe(3);
  });

  it('should calculate practice count', () => {
    fixture.detectChanges();
    expect(component.practiceCount()).toBe(1);
  });

  it('should calculate Olympiad count', () => {
    fixture.detectChanges();
    expect(component.olympiadCount()).toBe(2);
  });

  it('should show all attempts by default', () => {
    fixture.detectChanges();

    expect(component.selectedFilter()).toBe('ALL');
    expect(component.filteredAttempts()).toHaveLength(3);
  });

  it('should filter practice attempts', () => {
    fixture.detectChanges();

    component.setFilter('PRACTICE');

    expect(component.filteredAttempts()).toHaveLength(1);
    expect(component.filteredAttempts()[0].attemptType).toBe('PRACTICE');
  });

  it('should filter Olympiad attempts', () => {
    fixture.detectChanges();

    component.setFilter('OLYMPIAD');

    expect(component.filteredAttempts()).toHaveLength(2);
    expect(component.filteredAttempts().every((attempt) => attempt.attemptType === 'ASSESSMENT')).toBe(
      true,
    );
  });

  it('should calculate weighted average accuracy across all attempts', () => {
    fixture.detectChanges();
    expect(component.averageAccuracy()).toBe(46);
  });

  it('should calculate average accuracy for practice attempts', () => {
    fixture.detectChanges();

    component.setFilter('PRACTICE');

    expect(component.averageAccuracy()).toBe(100);
  });

  it('should calculate weighted average accuracy for Olympiad attempts', () => {
    fixture.detectChanges();

    component.setFilter('OLYMPIAD');

    expect(component.averageAccuracy()).toBe(44);
  });

  it('should return zero average accuracy when there are no filtered attempts', () => {
    fixture.detectChanges();

    component.setFilter('PRACTICE');
    component.attempts.set(attempts.filter((attempt) => attempt.attemptType === 'ASSESSMENT'));

    expect(component.practiceCount()).toBe(0);
    expect(component.averageAccuracy()).toBe(0);
  });

  it('should return the assessment title', () => {
    fixture.detectChanges();
    expect(component.getAttemptTitle(attempts[0])).toBe('Abacus Olympiad Test');
  });

  it('should fall back to the default assessment title', () => {
    fixture.detectChanges();

    expect(
      component.getAttemptTitle({ ...attempts[0], title: undefined }),
    ).toBe('Abacus Olympiad Test');
  });

  it('should generate a practice title using the topic id', () => {
    fixture.detectChanges();
    expect(component.getAttemptTitle(attempts[1])).toBe('Practice - single-digit-addition');
  });

  it('should use General when a practice attempt has no topic id', () => {
    fixture.detectChanges();

    expect(component.getAttemptTitle({ ...attempts[1], topicId: undefined })).toBe(
      'Practice - General',
    );
  });

  it('should return the correct attempt type label', () => {
    fixture.detectChanges();

    expect(component.getAttemptTypeLabel(attempts[0])).toBe('Olympiad');
    expect(component.getAttemptTypeLabel(attempts[1])).toBe('Practice');
  });

  it('should return the correct attempt icon', () => {
    fixture.detectChanges();

    expect(component.getAttemptIcon(attempts[0])).toBe('🏆');
    expect(component.getAttemptIcon(attempts[1])).toBe('🧮');
  });

  it('should navigate back to the dashboard', () => {
    component.onBackToHome();

    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should navigate an assessment attempt to its result route', () => {
    component.onViewAssessmentResult(attempts[0]);

    expect(router.navigate).toHaveBeenCalledWith(['/assessment/result', 'client-1']);
  });

  it('should stop loading after a successful response', () => {
    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
    expect(component.errorMessage()).toBe('');
  });

  it('should handle API errors', () => {
    attemptsApiServiceMock.getAttempts.mockReturnValue(throwError(() => new Error('API error')));

    fixture.detectChanges();

    expect(component.attempts()).toEqual([]);
    expect(component.errorMessage()).toBe('Unable to load assessment history. Please try again.');
    expect(component.isLoading()).toBe(false);
  });

  it('should handle an empty attempt history', () => {
    attemptsApiServiceMock.getAttempts.mockReturnValue(
      of({
        attempts: [],
        pagination: {
          page: 1,
          limit: 100,
          total: 0,
          totalPages: 0,
        },
      }),
    );

    fixture.detectChanges();

    expect(component.attempts()).toEqual([]);
    expect(component.totalAttempts()).toBe(0);
    expect(component.practiceCount()).toBe(0);
    expect(component.olympiadCount()).toBe(0);
    expect(component.averageAccuracy()).toBe(0);
    expect(component.filteredAttempts()).toEqual([]);
  });
});
