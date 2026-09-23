import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment.development';

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

interface ChildrenResponse {
  children: Child[];
}

interface CreateChildRequest {
  name: string;
  dateOfBirth?: string;
  grade?: string;
  avatar?: string;
}

interface CreateChildResponse {
  message: string;
  child: Child;
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
}
