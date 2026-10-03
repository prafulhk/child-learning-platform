import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ApiSuccessWithLegacy } from '../types/api-response';

export interface CreateLessonPlanRequest {
  childId: string;
  plannedDate: string;
  subjectId: string;
  topicId: string;
  skillId?: string;
  plannedActivity: string;
  plannedDurationMinutes: number;
  notes?: string;
}

export interface LessonPlan {
  _id: string;
  childId: string;
  plannedDate: string;
  subjectId: string;
  topicId: string;
  skillId?: string;
  plannedActivity: string;
  plannedDurationMinutes: number;
  notes?: string;
  status: 'PLANNED' | 'COMPLETED' | 'CANCELLED';
  completedLearningSessionId?: string;
  createdByUserId: string;
  createdByRole: 'PARENT';
  createdAt: string;
  updatedAt: string;
}

export type CreateLessonPlanResponse = ApiSuccessWithLegacy<LessonPlan, { lessonPlan: LessonPlan }>;

export interface GetLessonPlansParams {
  childId: string;
  fromDate?: string;
  toDate?: string;
  status?: 'PLANNED' | 'COMPLETED' | 'CANCELLED';
  page?: number;
  limit?: number;
}

export type GetLessonPlansResponse = ApiSuccessWithLegacy<
  {
    plans: LessonPlan[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  },
  {
    plans: LessonPlan[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }
>;

@Injectable({
  providedIn: 'root',
})
export class LessonPlanApi {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/lesson-plans`;

  createLessonPlan(payload: CreateLessonPlanRequest): Observable<CreateLessonPlanResponse> {
    return this.http.post<CreateLessonPlanResponse>(this.apiUrl, payload);
  }

  getLessonPlans(params: GetLessonPlansParams): Observable<GetLessonPlansResponse> {
    return this.http.get<GetLessonPlansResponse>(this.apiUrl, {
      params: {
        childId: params.childId,
        ...(params.fromDate ? { fromDate: params.fromDate } : {}),
        ...(params.toDate ? { toDate: params.toDate } : {}),
        ...(params.status ? { status: params.status } : {}),
        ...(params.page !== undefined ? { page: params.page } : {}),
        ...(params.limit !== undefined ? { limit: params.limit } : {}),
      },
    });
  }
}
