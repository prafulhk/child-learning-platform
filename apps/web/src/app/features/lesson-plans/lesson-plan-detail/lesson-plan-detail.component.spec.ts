import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ActiveChildService } from '../../../core/services/active-child.service';
import { ChildService } from '../../../core/services/child.service';
import { CatalogApiService } from '../../../core/services/catalog-api.service';
import { LessonPlanApi } from '../../../core/services/lesson-plan-api.service';
import { LessonPlanDetailComponent } from './lesson-plan-detail.component';

describe('LessonPlanDetailComponent', () => {
  let fixture: ComponentFixture<LessonPlanDetailComponent>;
  let component: LessonPlanDetailComponent;

  const lessonPlan = {
    _id: 'plan-1',
    childId: 'child-1',
    plannedDate: '2026-10-05T00:00:00.000Z',
    subjectId: 'subject-1',
    topicId: 'topic-1',
    plannedActivity: 'Practice single digit addition',
    plannedDurationMinutes: 30,
    notes: 'Focus on accuracy.',
    status: 'PLANNED' as const,
    createdByUserId: 'parent-1',
    createdByRole: 'PARENT' as const,
    createdAt: '2026-10-01T00:00:00.000Z',
    updatedAt: '2026-10-01T00:00:00.000Z',
  };

  const activeChildServiceMock = {
    activeChild: () => ({
      _id: 'child-1',
      parentId: 'parent-1',
      name: 'Aarav',
      grade: 'UKG',
      createdAt: '2026-09-01T00:00:00.000Z',
      updatedAt: '2026-09-01T00:00:00.000Z',
    }),
    setActiveChild: vi.fn(),
  };

  const lessonPlanApiMock = {
    getLessonPlanById: vi.fn(),
  };

  const childServiceMock = {
    getChildren: vi.fn(),
  };

  const catalogApiMock = {
    getSubjects: vi.fn(),
    getTopics: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    lessonPlanApiMock.getLessonPlanById.mockReturnValue(
      of({
        data: lessonPlan,
        lessonPlan,
      }),
    );

    catalogApiMock.getSubjects.mockReturnValue(
      of([
        {
          _id: 'subject-1',
          name: 'Abacus',
          code: 'ABACUS',
          category: 'MATH',
          sortOrder: 1,
          status: 'ACTIVE',
        },
      ]),
    );

    catalogApiMock.getTopics.mockReturnValue(
      of([
        {
          _id: 'topic-1',
          subjectId: 'subject-1',
          name: 'Single Digit Addition',
          code: 'SDA',
          sortOrder: 1,
          status: 'ACTIVE',
        },
      ]),
    );

    await TestBed.configureTestingModule({
      imports: [LessonPlanDetailComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ planId: 'plan-1' }),
            },
          },
        },
        {
          provide: LessonPlanApi,
          useValue: lessonPlanApiMock,
        },
        {
          provide: ActiveChildService,
          useValue: activeChildServiceMock,
        },
        {
          provide: ChildService,
          useValue: childServiceMock,
        },
        {
          provide: CatalogApiService,
          useValue: catalogApiMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LessonPlanDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create and load the lesson plan', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.plan()).toEqual(lessonPlan);
    expect(component.childName()).toBe('Aarav');
    expect(component.subjectName()).toBe('Abacus');
    expect(component.topicName()).toBe('Single Digit Addition');
  });

  it('shows an error when the detail API fails', () => {
    lessonPlanApiMock.getLessonPlanById.mockReturnValueOnce(
      throwError(() => ({ error: { message: 'Lesson plan not found.' } })),
    );

    fixture.detectChanges();

    expect(component.plan()).toBeNull();
    expect(component.errorMessage()).toBe('Lesson plan not found.');
  });

  it('shows an error when the route does not contain a plan id', () => {
    TestBed.resetTestingModule();
  });
});
