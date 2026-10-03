import { Routes } from '@angular/router';

import { guestGuard } from '../../core/guards/guest-guard';

export const authRoutes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./login/login').then(({ Login }) => Login),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./parent-registration/parent-registration').then(
        ({ ParentRegistration }) => ParentRegistration,
      ),
  },
  {
    path: 'register/teacher',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./teacher-registration/teacher-registration').then(
        ({ TeacherRegistration }) => TeacherRegistration,
      ),
  },
];
