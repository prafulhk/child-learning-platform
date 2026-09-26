import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

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

interface ApiResponse<T> {
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class CatalogApiService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = '/api/subjects';

  getSubjects(): Observable<Subject[]> {
    return this.http
      .get<ApiResponse<Subject[]>>(this.apiUrl)
      .pipe(map((response) => response.data));
  }

  getTopics(subjectId: string): Observable<Topic[]> {
    return this.http
      .get<ApiResponse<Topic[]>>(`${this.apiUrl}/${subjectId}/topics`)
      .pipe(map((response) => response.data));
  }
}
