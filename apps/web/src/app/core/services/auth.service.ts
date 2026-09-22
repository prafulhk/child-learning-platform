import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable, tap } from 'rxjs';

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface RegisterResponse {
  message: string;
  user: AuthUser;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: AuthUser;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/auth`;
  readonly currentUser = signal<AuthUser | null>(this.getStoredUser());
  readonly registrationMessage = signal('');

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, request);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).pipe(
      tap((response) => {
        sessionStorage.setItem('auth_token', response.token);
        sessionStorage.setItem('auth_user', JSON.stringify(response.user));
        this.currentUser.set(response.user);
      }),
    );
  }

  private getStoredUser(): AuthUser | null {
    const storedUser = sessionStorage.getItem('auth_user');

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as AuthUser;
    } catch {
      sessionStorage.removeItem('auth_user');
      return null;
    }
  }

  logout(): void {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_user');

    this.currentUser.set(null);
  }

  setRegistrationMessage(message: string): void {
    this.registrationMessage.set(message);
  }
}
