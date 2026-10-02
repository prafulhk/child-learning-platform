import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'learning',
    canActivate: [authGuard],
    children: [
      {
        path: 'practice',
        loadComponent: () =>
          import('./features/practice/practice-session.component').then(
            ({ PracticeSessionComponent }) => PracticeSessionComponent,
          ),
      },
      {
        path: 'log',
        loadComponent: () =>
          import('./features/learning/log-learning/log-learning').then(
            ({ LogLearningComponent }) => LogLearningComponent,
          ),
      },
      {
        path: 'history',
        loadComponent: () =>
          import('./features/history/learning-history.component').then(
            ({ LearningHistoryComponent }) => LearningHistoryComponent,
          ),
      },
    ],
  },
  {
    path: 'assessment',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/assessment/assessment-container.component').then(
        ({ AssessmentContainerComponent }) => AssessmentContainerComponent,
      ),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login').then(({ Login }) => Login),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/parent-registration/parent-registration').then(
        ({ ParentRegistration }) => ParentRegistration,
      ),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard-home/dashboard-home').then(
        ({ DashboardHome }) => DashboardHome,
      ),
  },
];
