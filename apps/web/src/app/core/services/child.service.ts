import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment.development';
import { ApiSuccessWithLegacy } from '../types/api-response';

export interface Child {
  _id: string;
  parentId: string;
  name: string;
  dateOfBirth?: string;
  grade?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

type ChildrenResponse = ApiSuccessWithLegacy<{ children: Child[] }, { children: Child[] }>;

type CreateChildResponse = ApiSuccessWithLegacy<
  { child: Child },
  { message: string; child: Child }
>;

type UpdateChildResponse = ApiSuccessWithLegacy<
  { child: Child },
  { message: string; child: Child }
>;

interface CreateChildRequest {
  name: string;
  dateOfBirth?: string;
  grade?: string;
  avatar?: string;
}

export interface UpdateChildRequest {
  name?: string;
  dateOfBirth?: string;
  grade?: string;
  avatar?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChildService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/children`;

  getChildren(): Observable<ChildrenResponse> {
    return this.http.get<ChildrenResponse>(this.apiUrl);
  }

  createChild(input: CreateChildRequest): Observable<CreateChildResponse> {
    return this.http.post<CreateChildResponse>(this.apiUrl, input);
  }

  updateChild(childId: string, input: UpdateChildRequest): Observable<UpdateChildResponse> {
    return this.http.post<UpdateChildResponse>(`${this.apiUrl}/${childId}/update`, input);
  }
}
