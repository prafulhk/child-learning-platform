import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ActiveChildService } from '../../../core/services/active-child.service';
import { ChildService } from '../../../core/services/child.service';
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

  const secondChild = {
    _id: 'child-2',
    parentId: 'parent-1',
    name: 'Anaya',
    grade: 'LKG',
    createdAt: '2026-09-02T00:00:00.000Z',
    updatedAt: '2026-09-02T00:00:00.000Z',
  };

  const lessonPlanApiMock = {
    getLessonPlans: vi.fn(),
  };

  const childServiceMock = {
    getChildren: vi.fn(),
  };

  const activeChildServiceMock = {
    activeChild: signal<typeof activeChild | null>(activeChild),
    setActiveChild: vi.fn(),
    clearActiveChild: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    childServiceMock.getChildren.mockReturnValue(
      of({
        children: [activeChild],
      }),
    );

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
          provide: ChildService,
          useValue: childServiceMock,
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

  it('loads children and upcoming plans for the active child using local midnight', () => {
    fixture.detectChanges();

    const today = new Date();
    const expectedFromDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    ).toISOString();

    expect(childServiceMock.getChildren).toHaveBeenCalled();
    expect(lessonPlanApiMock.getLessonPlans).toHaveBeenCalledWith({
      childId: 'child-1',
      fromDate: expectedFromDate,
      status: 'PLANNED',
      page: 1,
      limit: 25,
    });

    expect(component.selectedChildId()).toBe('child-1');
    expect(component.plans().length).toBe(1);
  });

  it('auto-selects the only child when no active child exists', () => {
    activeChildServiceMock.activeChild.set(null);

    fixture.detectChanges();

    expect(component.selectedChildId()).toBe('child-1');
    expect(activeChildServiceMock.setActiveChild).toHaveBeenCalledWith(activeChild);
    expect(lessonPlanApiMock.getLessonPlans).toHaveBeenCalled();
  });

  it('requires an explicit child choice when multiple children exist', () => {
    activeChildServiceMock.activeChild.set(null);
    childServiceMock.getChildren.mockReturnValueOnce(
      of({
        children: [activeChild, secondChild],
      }),
    );

    fixture.detectChanges();

    expect(component.selectedChildId()).toBe('');
    expect(lessonPlanApiMock.getLessonPlans).not.toHaveBeenCalled();
  });

  it('loads plans for the child selected in the dropdown', () => {
    activeChildServiceMock.activeChild.set(null);
    childServiceMock.getChildren.mockReturnValueOnce(
      of({
        children: [activeChild, secondChild],
      }),
    );

    fixture.detectChanges();

    component.onChildChange({
      target: { value: 'child-2' },
    } as unknown as Event);

    expect(component.selectedChildId()).toBe('child-2');
    expect(activeChildServiceMock.setActiveChild).toHaveBeenCalledWith(secondChild);
    expect(lessonPlanApiMock.getLessonPlans).toHaveBeenLastCalledWith(
      expect.objectContaining({
        childId: 'child-2',
        status: 'PLANNED',
      }),
    );
  });

  it('shows a no-child state when the parent has no children', () => {
    activeChildServiceMock.activeChild.set(null);
    childServiceMock.getChildren.mockReturnValueOnce(of({ children: [] }));

    fixture.detectChanges();

    expect(component.children()).toEqual([]);
    expect(component.selectedChildId()).toBe('');
    expect(lessonPlanApiMock.getLessonPlans).not.toHaveBeenCalled();
  });

  it('shows error message when child loading fails', () => {
    childServiceMock.getChildren.mockReturnValueOnce(
      throwError(() => new Error('failed')),
    );

    fixture.detectChanges();

    expect(component.childrenErrorMessage()).toBe('Unable to load child profiles.');
    expect(lessonPlanApiMock.getLessonPlans).not.toHaveBeenCalled();
  });

  it('shows error message when lesson plan loading fails', () => {
    lessonPlanApiMock.getLessonPlans.mockReturnValueOnce(
      throwError(() => new Error('failed')),
    );

    fixture.detectChanges();

    expect(component.errorMessage()).toBe('Unable to load upcoming lesson plans.');
    expect(component.plans()).toEqual([]);
  });
});
