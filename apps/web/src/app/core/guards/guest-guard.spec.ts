import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  provideRouter,
} from '@angular/router';
import { signal } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { guestGuard } from './guest-guard';

describe('guestGuard', () => {
  const currentUser = signal<ReturnType<AuthService['currentUser']>>(null);

  const authServiceMock = {
    currentUser: currentUser.asReadonly(),
  };

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => guestGuard(...guardParameters));

  const createRouterState = (url: string): RouterStateSnapshot =>
    ({
      url,
    }) as RouterStateSnapshot;

  beforeEach(() => {
    currentUser.set(null);

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    });
  });

  it('should allow unauthenticated users to access guest routes', () => {
    const result = executeGuard({} as ActivatedRouteSnapshot, createRouterState('/login'));

    expect(result).toBe(true);
  });

  it('should redirect authenticated users to dashboard', () => {
    currentUser.set({
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'PARENT',
      createdAt: '2026-09-29T00:00:00.000Z',
    });

    const result = executeGuard({} as ActivatedRouteSnapshot, createRouterState('/login'));

    expect(result).not.toBe(true);

    const router = TestBed.inject(Router);

    expect(router.serializeUrl(result as ReturnType<Router['createUrlTree']>)).toBe('/dashboard');
  });
});
