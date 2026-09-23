import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export type AttemptType = 'PRACTICE' | 'ASSESSMENT';

export interface BackendAttempt {
  _id: string;
  userId: string;
  attemptType: 'PRACTICE' | 'ASSESSMENT';
  clientAttemptId: string;
  topicId?: string;
  assessmentId?: string;
  title?: string;
  startedAt: string;
  completedAt: string;
  result: AttemptResult;
}

export interface AttemptsResponse {
  attempts: BackendAttempt[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AttemptResult {
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  accuracyPercentage: number;
}

export interface CreateAttemptPayload {
  clientAttemptId: string;
  attemptType: AttemptType;
  childId?: string;
  topicId?: string;
  assessmentId?: string;
  title?: string;
  startedAt: string;
  completedAt: string;
  presentedQuestions: unknown[];
  selectedAnswers: Record<string, string>;
  flaggedQuestionIds: string[];
  result: AttemptResult;
}

export interface AttemptResponse {
  message?: string;
  attempt: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class AttemptsApiService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/attempts`;

  saveAttempt(payload: CreateAttemptPayload): Observable<AttemptResponse> {
    return this.http.post<AttemptResponse>(this.apiUrl, payload);
  }

  getAttempts(type?: AttemptType, page = 1, limit = 20): Observable<AttemptsResponse> {
    let params = new HttpParams().set('page', page).set('limit', limit);

    if (type) {
      params = params.set('type', type);
    }

    return this.http.get<AttemptsResponse>(this.apiUrl, { params });
  }

  getAttemptById(attemptId: string): Observable<AttemptResponse> {
    return this.http.get<AttemptResponse>(`${this.apiUrl}/${attemptId}`);
  }
}
