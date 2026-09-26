import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment.development';

export interface LearningSessionAccuracy {
  correct: number;
  total: number;
  percentage: number;
}

export interface LearningSession {
  _id: string;
  childId: string;
  subjectId: string;
  topicId: string;
  skillId?: string;
  lessonPlanId?: string;
  learningDate: string;
  durationMinutes: number;
  whatWasTaught: string;
  performance: string;
  accuracy?: LearningSessionAccuracy;
  notes?: string;
  createdByUserId: string;
  createdByRole: 'PARENT' | 'TEACHER';
  createdAt: string;
  updatedAt: string;
}

export interface CreateLearningSessionRequest {
  childId: string;
  subjectId: string;
  topicId: string;
  skillId?: string;
  lessonPlanId?: string;
  learningDate: string;
  durationMinutes: number;
  whatWasTaught: string;
  performance: string;
  accuracy?: LearningSessionAccuracy;
  notes?: string;
}

export interface CreateLearningSessionResponse {
  data: LearningSession;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetLearningSessionsParams {
  childId: string;
  fromDate?: string;
  toDate?: string;
  subjectId?: string;
  topicId?: string;
  page?: number;
  limit?: number;
}

export interface GetLearningSessionsResponse {
  sessions: LearningSession[];
  pagination: Pagination;
}

@Injectable({
  providedIn: 'root',
})
export class LearningSessionsApiService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/learning-sessions`;

  createLearningSession(
    payload: CreateLearningSessionRequest,
  ): Observable<CreateLearningSessionResponse> {
    return this.http.post<CreateLearningSessionResponse>(this.apiUrl, payload);
  }

  getLearningSessions(params: GetLearningSessionsParams): Observable<GetLearningSessionsResponse> {
    let searchParams = new HttpParams().set('childId', params.childId);

    if (params.fromDate) {
      searchParams = searchParams.set('fromDate', params.fromDate);
    }

    if (params.toDate) {
      searchParams = searchParams.set('toDate', params.toDate);
    }

    if (params.subjectId) {
      searchParams = searchParams.set('subjectId', params.subjectId);
    }

    if (params.topicId) {
      searchParams = searchParams.set('topicId', params.topicId);
    }

    searchParams = searchParams.set('page', params.page ?? 1).set('limit', params.limit ?? 20);

    return this.http.get<GetLearningSessionsResponse>(this.apiUrl, { params: searchParams });
  }
}
