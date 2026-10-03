import { TestBed } from '@angular/core/testing';
import { CreateLessonPlanRequest, LessonPlanApi } from './lesson-plan-api.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

describe('LessonPlanApiService', () => {
  let service: LessonPlanApi;
  let httpTestingController: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/lesson-plans`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LessonPlanApi, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(LessonPlanApi);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a lesson plan', () => {
    const payload: CreateLessonPlanRequest = {
      childId: '507f1f77bcf86cd799439011',
      plannedDate: '2026-09-28T00:00:00.000Z',
      subjectId: '507f1f77bcf86cd799439012',
      topicId: '507f1f77bcf86cd799439013',
      plannedActivity: 'Practice single digit addition',
      plannedDurationMinutes: 30,
      notes: 'Focus on accuracy',
    };

    const mockResponse = {
      success: true as const,
      data: {
        _id: '507f1f77bcf86cd799439014',
        ...payload,
        status: 'PLANNED' as const,
        createdByUserId: '507f1f77bcf86cd799439015',
        createdByRole: 'PARENT' as const,
        createdAt: '2026-09-28T10:00:00.000Z',
        updatedAt: '2026-09-28T10:00:00.000Z',
      },
      lessonPlan: {
        _id: '507f1f77bcf86cd799439014',
        ...payload,
        status: 'PLANNED' as const,
        createdByUserId: '507f1f77bcf86cd799439015',
        createdByRole: 'PARENT' as const,
        createdAt: '2026-09-28T10:00:00.000Z',
        updatedAt: '2026-09-28T10:00:00.000Z',
      },
    };

    service.createLessonPlan(payload).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const request = httpTestingController.expectOne(apiUrl);

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(payload);

    request.flush(mockResponse);
  });

  it('should get lesson plans', () => {
    const mockResponse = {
      success: true as const,
      data: {
        plans: [
          {
            _id: '507f1f77bcf86cd799439014',
            childId: '507f1f77bcf86cd799439011',
            plannedDate: '2026-09-28T00:00:00.000Z',
            subjectId: '507f1f77bcf86cd799439012',
            topicId: '507f1f77bcf86cd799439013',
            plannedActivity: 'Practice single digit addition',
            plannedDurationMinutes: 30,
            status: 'PLANNED' as const,
            createdByUserId: '507f1f77bcf86cd799439015',
            createdByRole: 'PARENT' as const,
            createdAt: '2026-09-28T10:00:00.000Z',
            updatedAt: '2026-09-28T10:00:00.000Z',
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          totalPages: 1,
        },
      },
      plans: [
        {
          _id: '507f1f77bcf86cd799439014',
          childId: '507f1f77bcf86cd799439011',
          plannedDate: '2026-09-28T00:00:00.000Z',
          subjectId: '507f1f77bcf86cd799439012',
          topicId: '507f1f77bcf86cd799439013',
          plannedActivity: 'Practice single digit addition',
          plannedDurationMinutes: 30,
          status: 'PLANNED' as const,
          createdByUserId: '507f1f77bcf86cd799439015',
          createdByRole: 'PARENT' as const,
          createdAt: '2026-09-28T10:00:00.000Z',
          updatedAt: '2026-09-28T10:00:00.000Z',
        },
      ],
      pagination: {
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      },
    };

    service
      .getLessonPlans({
        childId: '507f1f77bcf86cd799439011',
        fromDate: '2026-09-28',
        toDate: '2026-09-30',
        status: 'PLANNED',
      })
      .subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

    const request = httpTestingController.expectOne(
      (req) =>
        req.url === apiUrl &&
        req.params.get('childId') === '507f1f77bcf86cd799439011' &&
        req.params.get('fromDate') === '2026-09-28' &&
        req.params.get('toDate') === '2026-09-30' &&
        req.params.get('status') === 'PLANNED',
    );

    expect(request.request.method).toBe('GET');

    request.flush(mockResponse);
  });
});
