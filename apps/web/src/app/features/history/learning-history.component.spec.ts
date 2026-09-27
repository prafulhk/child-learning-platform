import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { LearningHistoryComponent } from './learning-history.component';
import { ActiveChildService } from '../../core/services/active-child.service';
import {
  CatalogApiService,
  type Subject,
  type Topic,
} from '../../core/services/catalog-api.service';
import { LearningSessionsApiService } from '../../core/services/learning-sessions-api.service';

describe('LearningHistoryComponent', () => {
  let component: LearningHistoryComponent;
  let fixture: ComponentFixture<LearningHistoryComponent>;

  const activeChild = {
    _id: 'child-1',
    name: 'Aarav',
  };

  const learningSessionsApiServiceMock = {
    getLearningSessions: vi.fn(),
  };

  const catalogApiServiceMock = {
    getSubjects: vi.fn(),
    getTopics: vi.fn(),
  };

  const activeChildServiceMock = {
    activeChild: signal<typeof activeChild | null>(activeChild),
  };

  const subjects: Subject[] = [
    {
      _id: 'abacus',
      name: 'Abacus',
      code: 'ABACUS',
      category: 'ACADEMIC',
      sortOrder: 1,
      status: 'ACTIVE',
    },
    {
      _id: 'english',
      name: 'English',
      code: 'ENGLISH',
      category: 'ACADEMIC',
      sortOrder: 2,
      status: 'ACTIVE',
    },
  ];

  const topics: Topic[] = [
    {
      _id: 'single-digit-addition',
      subjectId: 'abacus',
      name: 'Single Digit Addition',
      code: 'SINGLE_DIGIT_ADDITION',
      sortOrder: 1,
      status: 'ACTIVE',
    },
    {
      _id: 'reading',
      subjectId: 'english',
      name: 'Reading',
      code: 'READING',
      sortOrder: 1,
      status: 'ACTIVE',
    },
  ];

  const learningSessions = [
    {
      _id: 'session-1',
      childId: 'child-1',
      subjectId: 'abacus',
      topicId: 'single-digit-addition',
      learningDate: '2026-09-27T00:00:00.000Z',
      durationMinutes: 30,
      whatWasTaught: 'Practised single digit addition.',
      performance: 'Good',
      accuracy: {
        correct: 8,
        total: 10,
        percentage: 80,
      },
      notes: 'Needs more practice with faster calculations.',
      createdByUserId: 'parent-1',
      createdByRole: 'PARENT' as const,
      createdAt: '2026-09-27T10:00:00.000Z',
      updatedAt: '2026-09-27T10:00:00.000Z',
    },
    {
      _id: 'session-2',
      childId: 'child-1',
      subjectId: 'english',
      topicId: 'reading',
      learningDate: '2026-09-26T00:00:00.000Z',
      durationMinutes: 45,
      whatWasTaught: 'Read simple sentences.',
      performance: 'Excellent',
      accuracy: {
        correct: 6,
        total: 10,
        percentage: 60,
      },
      createdByUserId: 'parent-1',
      createdByRole: 'PARENT' as const,
      createdAt: '2026-09-26T10:00:00.000Z',
      updatedAt: '2026-09-26T10:00:00.000Z',
    },
  ];

  beforeEach(async () => {
    vi.clearAllMocks();

    learningSessionsApiServiceMock.getLearningSessions.mockReturnValue(
      of({
        sessions: learningSessions,
        pagination: {
          page: 1,
          limit: 20,
          total: 2,
          totalPages: 1,
        },
      }),
    );

    catalogApiServiceMock.getSubjects.mockReturnValue(of(subjects));

    catalogApiServiceMock.getTopics.mockImplementation((subjectId: string) => {
      if (subjectId === 'abacus') {
        return of([topics[0]]);
      }

      if (subjectId === 'english') {
        return of([topics[1]]);
      }

      return of([]);
    });

    activeChildServiceMock.activeChild.set(activeChild);

    await TestBed.configureTestingModule({
      imports: [LearningHistoryComponent],
      providers: [
        {
          provide: LearningSessionsApiService,
          useValue: learningSessionsApiServiceMock,
        },
        {
          provide: ActiveChildService,
          useValue: activeChildServiceMock,
        },
        {
          provide: CatalogApiService,
          useValue: catalogApiServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LearningHistoryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should load learning sessions for the active child', () => {
    fixture.detectChanges();

    expect(learningSessionsApiServiceMock.getLearningSessions).toHaveBeenCalledWith({
      childId: 'child-1',
      page: 1,
      limit: 20,
    });

    expect(component.learningSessions()).toEqual(learningSessions);
  });

  it('should load subjects for learning history', () => {
    fixture.detectChanges();

    expect(catalogApiServiceMock.getSubjects).toHaveBeenCalledTimes(1);
    expect(component.subjects()).toEqual(subjects);
  });

  it('should load topics for subjects used by learning sessions', () => {
    fixture.detectChanges();

    expect(catalogApiServiceMock.getTopics).toHaveBeenCalledWith('abacus');
    expect(catalogApiServiceMock.getTopics).toHaveBeenCalledWith('english');

    expect(catalogApiServiceMock.getTopics).toHaveBeenCalledTimes(2);
    expect(component.topics()).toEqual(topics);
  });

  it('should resolve subject ids to subject names', () => {
    fixture.detectChanges();

    expect(component.getSubjectName('abacus')).toBe('Abacus');
    expect(component.getSubjectName('english')).toBe('English');
  });

  it('should resolve topic ids to topic names', () => {
    fixture.detectChanges();

    expect(component.getTopicName('single-digit-addition')).toBe('Single Digit Addition');

    expect(component.getTopicName('reading')).toBe('Reading');
  });

  it('should fall back to the id when a subject is not found', () => {
    fixture.detectChanges();

    expect(component.getSubjectName('unknown-subject')).toBe('unknown-subject');
  });

  it('should fall back to the id when a topic is not found', () => {
    fixture.detectChanges();

    expect(component.getTopicName('unknown-topic')).toBe('unknown-topic');
  });

  it('should calculate total sessions', () => {
    fixture.detectChanges();

    expect(component.totalSessions()).toBe(2);
  });

  it('should calculate total learning minutes', () => {
    fixture.detectChanges();

    expect(component.totalLearningMinutes()).toBe(75);
  });

  it('should calculate average accuracy from sessions with accuracy', () => {
    fixture.detectChanges();

    expect(component.averageAccuracy()).toBe(70);
  });

  it('should return null for average accuracy when no session has accuracy', () => {
    learningSessionsApiServiceMock.getLearningSessions.mockReturnValue(
      of({
        sessions: [
          {
            ...learningSessions[0],
            accuracy: undefined,
          },
          {
            ...learningSessions[1],
            accuracy: undefined,
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 2,
          totalPages: 1,
        },
      }),
    );

    fixture.detectChanges();

    expect(component.averageAccuracy()).toBeNull();
  });

  it('should show an error when no active child is selected', () => {
    activeChildServiceMock.activeChild.set(null);

    fixture.detectChanges();

    expect(component.errorMessage()).toBe('Please select a child to view learning history.');

    expect(learningSessionsApiServiceMock.getLearningSessions).not.toHaveBeenCalled();

    expect(catalogApiServiceMock.getSubjects).not.toHaveBeenCalled();
  });

  it('should handle learning history API errors', () => {
    learningSessionsApiServiceMock.getLearningSessions.mockReturnValue(
      throwError(() => new Error('API error')),
    );

    fixture.detectChanges();

    expect(component.learningSessions()).toEqual([]);

    expect(component.errorMessage()).toBe('Unable to load learning history. Please try again.');

    expect(component.isLoading()).toBe(false);

    expect(catalogApiServiceMock.getSubjects).not.toHaveBeenCalled();
  });

  it('should stop loading after a successful response', () => {
    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
  });

  it('should stop loading after an API error', () => {
    learningSessionsApiServiceMock.getLearningSessions.mockReturnValue(
      throwError(() => new Error('API error')),
    );

    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
  });

  it('should stop loading when there are no learning sessions', () => {
    learningSessionsApiServiceMock.getLearningSessions.mockReturnValue(
      of({
        sessions: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
      }),
    );

    fixture.detectChanges();

    expect(component.learningSessions()).toEqual([]);
    expect(component.isLoading()).toBe(false);

    expect(catalogApiServiceMock.getSubjects).not.toHaveBeenCalled();
  });
});
