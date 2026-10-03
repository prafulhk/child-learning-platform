import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { LogLearningComponent } from './log-learning';
import { CatalogApiService } from '../../../core/services/catalog-api.service';
import { ActiveChildService } from '../../../core/services/active-child.service';
import { ChildService } from '../../../core/services/child.service';
import { LearningSessionsApiService } from '../../../core/services/learning-sessions-api.service';
import { LessonPlanApi } from '../../../core/services/lesson-plan-api.service';
import { ToastService } from '../../../core/services/toast';

describe('LogLearningComponent', () => {
  let component: LogLearningComponent;
  let fixture: ComponentFixture<LogLearningComponent>;

  const activeChild = {
    _id: 'child-1',
    name: 'Aarav',
  };

  const catalogApiServiceMock = {
    getSubjects: vi.fn(),
    getTopics: vi.fn(),
  };

  const activeChildServiceMock = {
    activeChild: signal(activeChild),
    setActiveChild: vi.fn(),
  };

  const childServiceMock = {
    getChildren: vi.fn(),
  };

  const learningSessionsApiServiceMock = {
    createLearningSession: vi.fn(),
  };

  const lessonPlanApiMock = {
    getLessonPlanById: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  const toastServiceMock = {
    success: vi.fn(),
    error: vi.fn(),
  };

  const activatedRouteMock = {
    snapshot: {
      queryParamMap: {
        get: vi.fn().mockReturnValue(null),
      },
    },
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    catalogApiServiceMock.getSubjects.mockReturnValue(
      of([
        {
          _id: 'subject-1',
          name: 'Abacus',
        },
      ]),
    );

    catalogApiServiceMock.getTopics.mockReturnValue(
      of([
        {
          _id: 'topic-1',
          subjectId: 'subject-1',
          name: 'Single Digit Addition',
        },
      ]),
    );

    childServiceMock.getChildren.mockReturnValue(
      of({
        children: [activeChild],
      }),
    );

    lessonPlanApiMock.getLessonPlanById.mockReturnValue(
      of({
        data: null,
      }),
    );

    learningSessionsApiServiceMock.createLearningSession.mockReturnValue(
      of({
        data: {
          _id: 'session-1',
        },
      }),
    );

    await TestBed.configureTestingModule({
      imports: [LogLearningComponent],
      providers: [
        {
          provide: CatalogApiService,
          useValue: catalogApiServiceMock,
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
          provide: LearningSessionsApiService,
          useValue: learningSessionsApiServiceMock,
        },
        {
          provide: LessonPlanApi,
          useValue: lessonPlanApiMock,
        },
        {
          provide: ToastService,
          useValue: toastServiceMock,
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock,
        },
        {
          provide: Router,
          useValue: routerMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LogLearningComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load subjects on initialization', () => {
    expect(catalogApiServiceMock.getSubjects).toHaveBeenCalled();
    expect(component.subjects()).toEqual([
      {
        _id: 'subject-1',
        name: 'Abacus',
      },
    ]);
  });

  it('should load topics when a subject is selected', () => {
    component.learningForm.controls.subjectId.setValue('subject-1');

    component.onSubjectChange();

    expect(catalogApiServiceMock.getTopics).toHaveBeenCalledWith('subject-1');

    expect(component.topics()).toEqual([
      {
        _id: 'topic-1',
        subjectId: 'subject-1',
        name: 'Single Digit Addition',
      },
    ]);
  });

  it('should include accuracy in the learning session payload', () => {
    component.learningForm.controls.subjectId.setValue('subject-1');

    component.onSubjectChange();

    component.learningForm.controls.topicId.setValue('topic-1');
    component.learningForm.controls.learningDate.setValue('2026-09-27');
    component.learningForm.controls.durationMinutes.setValue(30);
    component.learningForm.controls.whatWasTaught.setValue('Practised single digit addition.');
    component.learningForm.controls.performance.setValue('Excellent');
    component.learningForm.controls.accuracy.setValue(85);
    component.learningForm.controls.notes.setValue('Good progress.');

    component.onSave();

    expect(learningSessionsApiServiceMock.createLearningSession).toHaveBeenCalledWith(
      expect.objectContaining({
        childId: 'child-1',
        subjectId: 'subject-1',
        topicId: 'topic-1',
        durationMinutes: 30,
        whatWasTaught: 'Practised single digit addition.',
        performance: 'Excellent',
        accuracy: {
          correct: 85,
          total: 100,
          percentage: 85,
        },
        notes: 'Good progress.',
        lessonPlanId: undefined,
      }),
    );
  });

  it('should omit accuracy when no accuracy is entered', () => {
    component.learningForm.controls.subjectId.setValue('subject-1');

    component.onSubjectChange();

    component.learningForm.controls.topicId.setValue('topic-1');
    component.learningForm.controls.learningDate.setValue('2026-09-27');
    component.learningForm.controls.durationMinutes.setValue(30);
    component.learningForm.controls.whatWasTaught.setValue('Practised single digit addition.');
    component.learningForm.controls.performance.setValue('Good');
    component.learningForm.controls.accuracy.setValue(null);

    component.onSave();

    expect(learningSessionsApiServiceMock.createLearningSession).toHaveBeenCalledWith(
      expect.objectContaining({
        childId: 'child-1',
        subjectId: 'subject-1',
        topicId: 'topic-1',
        durationMinutes: 30,
        whatWasTaught: 'Practised single digit addition.',
        performance: 'Good',
        accuracy: undefined,
        lessonPlanId: undefined,
      }),
    );
  });
});
