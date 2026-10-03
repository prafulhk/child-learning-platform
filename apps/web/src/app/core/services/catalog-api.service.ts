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
}
