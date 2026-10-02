import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ActiveChildService } from '../../../core/services/active-child.service';
import { LessonPlanApi } from '../../../core/services/lesson-plan-api.service';
import { UpcomingLessonPlansComponent } from './upcoming-lesson-plans.component';

describe('UpcomingLessonPlansComponent', () => {
  let fixture: ComponentFixture<UpcomingLessonPlansComponent>;
  let component: UpcomingLessonPlansComponent;

  const activeChild = {
    _id: 'child-1',
    parentId: 'parent-1',
    name: 'Aarav',
    grade: 'UKG',
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  };

  const lessonPlanApiMock = {
    getLessonPlans: vi.fn(),
  };

  const activeChildServiceMock = {
    activeChild: signal<typeof activeChild | null>(activeChild),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    lessonPlanApiMock.getLessonPlans.mockReturnValue(
      of({
        plans: [
          {
            _id: 'plan-1',
            childId: 'child-1',
            plannedDate: '2026-10-03T00:00:00.000Z',
            subjectId: 'abacus',
            topicId: 'single-digit-addition',
            plannedActivity: 'Practice 10 sums',
            plannedDurationMinutes: 30,
            status: 'PLANNED',
            createdByUserId: 'parent-1',
            createdByRole: 'PARENT',
            createdAt: '2026-10-01T00:00:00.000Z',
            updatedAt: '2026-10-01T00:00:00.000Z',
          },
        ],
        pagination: {
          page: 1,
          limit: 25,
          total: 1,
          totalPages: 1,
        },
      }),
    );

    await TestBed.configureTestingModule({
      imports: [UpcomingLessonPlansComponent],
      providers: [
        provideRouter([]),
        {
          provide: LessonPlanApi,
          useValue: lessonPlanApiMock,
        },
        {
          provide: ActiveChildService,
          useValue: activeChildServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpcomingLessonPlansComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('loads upcoming plans for the active child', () => {
    fixture.detectChanges();

    expect(lessonPlanApiMock.getLessonPlans).toHaveBeenCalledWith({
      childId: 'child-1',
      status: 'PLANNED',
      page: 1,
      limit: 25,
    });

    expect(component.plans().length).toBe(1);
  });

  it('shows explicit message when no active child is selected', () => {
    activeChildServiceMock.activeChild.set(null);

    fixture.detectChanges();

    expect(component.errorMessage()).toBe('Please select a child first to view upcoming lesson plans.');
    expect(lessonPlanApiMock.getLessonPlans).not.toHaveBeenCalled();
  });

  it('shows error message when API fails', () => {
    lessonPlanApiMock.getLessonPlans.mockReturnValueOnce(throwError(() => new Error('failed')));

    fixture.detectChanges();

    expect(component.errorMessage()).toBe('Unable to load upcoming lesson plans.');
    expect(component.plans()).toEqual([]);
  });
});
