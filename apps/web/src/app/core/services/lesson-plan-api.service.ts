import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

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

export interface CreateLessonPlanResponse {
  lessonPlan: LessonPlan;
}

@Injectable({
  providedIn: 'root',
})
export class LessonPlanApi {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/lesson-plans`;

  createLessonPlan(payload: CreateLessonPlanRequest): Observable<CreateLessonPlanResponse> {
    return this.http.post<CreateLessonPlanResponse>(this.apiUrl, payload);
  }
}
