import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ApiSuccessResponse } from '../types/api-response';

export interface Subject {
  _id: string;
  name: string;
  code: string;
  description?: string;
  category: string;
  sortOrder: number;
  status: string;
}

export interface Topic {
  _id: string;
  subjectId: string;
  name: string;
  code: string;
  description?: string;
  sortOrder: number;
  status: string;
}

export interface SubjectInput {
  name: string;
  code: string;
  description?: string;
  sortOrder: number;
}

@Injectable({
  providedIn: 'root',
})
export class CatalogApiService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/subjects`;

  getSubjects(): Observable<Subject[]> {
    return this.http
      .get<ApiSuccessResponse<Subject[]>>(this.apiUrl)
      .pipe(map((response) => response.data));
  }

  getTopics(subjectId: string): Observable<Topic[]> {
    return this.http
      .get<ApiSuccessResponse<Topic[]>>(`${this.apiUrl}/${subjectId}/topics`)
      .pipe(map((response) => response.data));
  }

  getAdminSubjects(): Observable<Subject[]> {
    return this.http
      .get<ApiSuccessResponse<Subject[]>>(`${this.apiUrl}/admin/all`)
      .pipe(map((response) => response.data));
  }

  createSubject(input: SubjectInput): Observable<Subject> {
    return this.http
      .post<ApiSuccessResponse<{ subject: Subject }>>(this.apiUrl, input)
      .pipe(map((response) => response.data.subject));
  }

  updateSubject(subjectId: string, input: Partial<SubjectInput>): Observable<Subject> {
    return this.http
      .post<ApiSuccessResponse<{ subject: Subject }>>(
        `${this.apiUrl}/${subjectId}/update`,
        input,
      )
      .pipe(map((response) => response.data.subject));
  }

  updateSubjectStatus(
    subjectId: string,
    status: 'ACTIVE' | 'INACTIVE',
  ): Observable<Subject> {
    return this.http
      .post<ApiSuccessResponse<{ subject: Subject }>>(
        `${this.apiUrl}/${subjectId}/status`,
        { status },
      )
      .pipe(map((response) => response.data.subject));
  }
}
