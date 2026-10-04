import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { catchError, EMPTY, Observable, tap } from 'rxjs';
import { ApiSuccessWithLegacy } from '../types/api-response';

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

export interface UpdateProfileRequest {
  name: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export type RegisterResponse = ApiSuccessWithLegacy<
  { user: AuthUser },
  { message: string; user: AuthUser }
>;

export type LoginResponse = ApiSuccessWithLegacy<
  { token: string; user: AuthUser },
  { message: string; token: string; user: AuthUser }
>;

type MeResponse = ApiSuccessWithLegacy<{ user: AuthUser }, { user: AuthUser }>;

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

  registerTeacher(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.apiUrl}/register/teacher`,
      request,
    );
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).pipe(
      tap((response) => {
        const token = response.token ?? response.data.token;
        const user = response.user ?? response.data.user;

        sessionStorage.setItem('auth_token', token);
        sessionStorage.setItem('auth_user', JSON.stringify(user));
        this.currentUser.set(user);
      }),
    );
  }

  updateProfile(request: UpdateProfileRequest): Observable<MeResponse> {
    return this.http.patch<MeResponse>(`${this.apiUrl}/me`, request).pipe(
      tap((response) => {
        const user = response.user ?? response.data.user;

        this.currentUser.set(user);
        sessionStorage.setItem('auth_user', JSON.stringify(user));
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

  getCurrentUser(): Observable<MeResponse> {
    return this.http.get<MeResponse>(`${this.apiUrl}/me`);
  }

  restoreSession(): Observable<unknown> {
    const token = sessionStorage.getItem('auth_token');

    if (!token) {
      return EMPTY;
    }

    return this.getCurrentUser().pipe(
      tap((response) => {
        const user = response.user ?? response.data.user;

        this.currentUser.set(user);
        sessionStorage.setItem('auth_user', JSON.stringify(user));
      }),
      catchError(() => {
        this.logout();
        return EMPTY;
      }),
    );
  }
}
