import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ActiveChildService } from '../../../core/services/active-child.service';
import { CatalogApiService } from '../../../core/services/catalog-api.service';
import { LessonPlanApi } from '../../../core/services/lesson-plan-api.service';
import { CreateLessonPlan } from './create-lesson-plan';

describe('CreateLessonPlan', () => {
  let component: CreateLessonPlan;
  let fixture: ComponentFixture<CreateLessonPlan>;

  const activeChild = {
    _id: 'child-1',
    parentId: 'parent-1',
    name: 'Aarav',
    grade: 'UKG',
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  };

  const catalogApiServiceMock = {
    getSubjects: vi.fn().mockReturnValue(
      of([
        {
          _id: 'subject-1',
          name: 'Abacus',
        },
      ]),
    ),
    getTopics: vi.fn().mockReturnValue(
      of([
        {
          _id: 'topic-1',
          subjectId: 'subject-1',
          name: 'Single Digit Addition',
        },
      ]),
    ),
  };

  const lessonPlanApiMock = {
    createLessonPlan: vi.fn().mockReturnValue(
      of({
        lessonPlan: {
          _id: 'plan-1',
        },
      }),
    ),
  };

  const activeChildServiceMock = {
    activeChild: signal<typeof activeChild | null>(activeChild),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [CreateLessonPlan],
      providers: [
        provideRouter([]),
        {
          provide: CatalogApiService,
          useValue: catalogApiServiceMock,
        },
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

    fixture = TestBed.createComponent(CreateLessonPlan);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show explicit error when active child is missing', () => {
    activeChildServiceMock.activeChild.set(null);

    component.lessonPlanForm.controls.subjectId.setValue('subject-1');
    component.lessonPlanForm.controls.topicId.setValue('topic-1');
    component.lessonPlanForm.controls.plannedActivity.setValue('Practice addition');
    component.lessonPlanForm.controls.plannedDurationMinutes.setValue(30);

    component.onSave();

    expect(component.errorMessage()).toBe('Please select a child before creating a lesson plan.');
    expect(lessonPlanApiMock.createLessonPlan).not.toHaveBeenCalled();
  });

  it('should create a lesson plan using active child context', () => {
    component.lessonPlanForm.controls.subjectId.setValue('subject-1');
    component.onSubjectChange();
    component.lessonPlanForm.controls.topicId.setValue('topic-1');
    component.lessonPlanForm.controls.plannedDate.setValue('2026-10-02');
    component.lessonPlanForm.controls.plannedActivity.setValue('Practice addition');
    component.lessonPlanForm.controls.plannedDurationMinutes.setValue(30);
    component.lessonPlanForm.controls.notes.setValue('Daily drill');

    component.onSave();

    expect(lessonPlanApiMock.createLessonPlan).toHaveBeenCalledWith(
      expect.objectContaining({
        childId: 'child-1',
        subjectId: 'subject-1',
        topicId: 'topic-1',
        plannedActivity: 'Practice addition',
        plannedDurationMinutes: 30,
        notes: 'Daily drill',
      }),
    );
  });
});
