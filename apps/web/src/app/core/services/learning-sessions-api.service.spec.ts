import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { environment } from '../../../environments/environment.development';

import {
  CreateLearningSessionRequest,
  CreateLearningSessionResponse,
  GetLearningSessionsResponse,
  LearningSession,
  LearningSessionsApiService,
} from './learning-sessions-api.service';

describe('LearningSessionsApiService', () => {
  let service: LearningSessionsApiService;
  let httpTesting: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/learning-sessions`;

  const learningSession: LearningSession = {
    _id: 'session-1',
    childId: 'child-1',
    subjectId: 'subject-1',
    topicId: 'topic-1',
    learningDate: '2026-09-24T10:00:00.000Z',
    durationMinutes: 30,
    whatWasTaught: 'Introduced 5-bead combinations.',
    performance: 'GOOD',
    accuracy: {
      correct: 8,
      total: 10,
      percentage: 80,
    },
    createdByUserId: 'user-1',
    createdByRole: 'PARENT',
    createdAt: '2026-09-24T10:00:00.000Z',
    updatedAt: '2026-09-24T10:00:00.000Z',
  };

  const createPayload: CreateLearningSessionRequest = {
    childId: 'child-1',
    subjectId: 'subject-1',
    topicId: 'topic-1',
    learningDate: '2026-09-24T10:00:00.000Z',
    durationMinutes: 30,
    whatWasTaught: 'Introduced 5-bead combinations.',
    performance: 'GOOD',
    accuracy: {
      correct: 8,
      total: 10,
      percentage: 80,
    },
    notes: 'Concept understood but speed needs practice.',
  };

  const emptyResponse: GetLearningSessionsResponse = {
    sessions: [],
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(LearningSessionsApiService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createLearningSession', () => {
    it('sends a POST request to the learning-sessions endpoint', () => {
      service.createLearningSession(createPayload).subscribe();

      const req = httpTesting.expectOne((request) => request.url === apiUrl);

      expect(req.request.method).toBe('POST');
      expect(req.request.url).toBe(apiUrl);

      req.flush({ data: learningSession });
    });

    it('sends the expected request body', () => {
      service.createLearningSession(createPayload).subscribe();

      const req = httpTesting.expectOne((request) => request.url === apiUrl);

      expect(req.request.body).toEqual(createPayload);

      req.flush({ data: learningSession });
    });

    it('returns the created learning session response', () => {
      const response: CreateLearningSessionResponse = { data: learningSession };

      let actual: CreateLearningSessionResponse | undefined;
      service.createLearningSession(createPayload).subscribe((result) => {
        actual = result;
      });

      const req = httpTesting.expectOne((request) => request.url === apiUrl);
      req.flush(response);

      expect(actual).toEqual(response);
    });
  });

  describe('getLearningSessions', () => {
    it('sends a GET request with the required childId to the learning-sessions endpoint', () => {
      service.getLearningSessions({ childId: 'child-1' }).subscribe();

      const req = httpTesting.expectOne((request) => request.url === apiUrl);

      expect(req.request.method).toBe('GET');
      expect(req.request.url).toBe(apiUrl);
      expect(req.request.params.get('childId')).toBe('child-1');

      req.flush(emptyResponse);
    });

    it('includes the optional filters when supplied', () => {
      service
        .getLearningSessions({
          childId: 'child-1',
          fromDate: '2026-09-01',
          toDate: '2026-09-24',
          subjectId: 'subject-1',
          topicId: 'topic-1',
        })
        .subscribe();

      const req = httpTesting.expectOne((request) => request.url === apiUrl);

      expect(req.request.params.get('fromDate')).toBe('2026-09-01');
      expect(req.request.params.get('toDate')).toBe('2026-09-24');
      expect(req.request.params.get('subjectId')).toBe('subject-1');
      expect(req.request.params.get('topicId')).toBe('topic-1');

      req.flush(emptyResponse);
    });

    it('omits the optional filters when not supplied', () => {
      service.getLearningSessions({ childId: 'child-1' }).subscribe();

      const req = httpTesting.expectOne((request) => request.url === apiUrl);

      expect(req.request.params.has('fromDate')).toBe(false);
      expect(req.request.params.has('toDate')).toBe(false);
      expect(req.request.params.has('subjectId')).toBe(false);
      expect(req.request.params.has('topicId')).toBe(false);

      req.flush(emptyResponse);
    });

    it('includes the supplied pagination parameters', () => {
      service.getLearningSessions({ childId: 'child-1', page: 2, limit: 50 }).subscribe();

      const req = httpTesting.expectOne((request) => request.url === apiUrl);

      expect(req.request.params.get('page')).toBe('2');
      expect(req.request.params.get('limit')).toBe('50');

      req.flush(emptyResponse);
    });

    it('falls back to the default pagination when page and limit are not supplied', () => {
      service.getLearningSessions({ childId: 'child-1' }).subscribe();

      const req = httpTesting.expectOne((request) => request.url === apiUrl);

      expect(req.request.params.get('page')).toBe('1');
      expect(req.request.params.get('limit')).toBe('20');
      expect(req.request.params.keys()).toEqual(['childId', 'page', 'limit']);

      req.flush(emptyResponse);
    });

    it('builds the full query string for all supplied parameters', () => {
      service
        .getLearningSessions({
          childId: 'child-1',
          fromDate: '2026-09-01',
          toDate: '2026-09-24',
          subjectId: 'subject-1',
          topicId: 'topic-1',
          page: 1,
          limit: 20,
        })
        .subscribe();

      const req = httpTesting.expectOne((request) => request.url === apiUrl);

      expect(req.request.urlWithParams).toBe(
        `${apiUrl}?childId=child-1&fromDate=2026-09-01&toDate=2026-09-24&subjectId=subject-1&topicId=topic-1&page=1&limit=20`,
      );

      req.flush(emptyResponse);
    });

    it('returns the learning sessions response', () => {
      const response: GetLearningSessionsResponse = {
        sessions: [learningSession],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          totalPages: 1,
        },
      };

      let actual: GetLearningSessionsResponse | undefined;
      service.getLearningSessions({ childId: 'child-1' }).subscribe((result) => {
        actual = result;
      });

      const req = httpTesting.expectOne((request) => request.url === apiUrl);
      req.flush(response);

      expect(actual).toEqual(response);
    });
  });
});
