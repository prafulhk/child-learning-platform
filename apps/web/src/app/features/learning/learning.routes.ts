import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth-guard';

export const learningRoutes: Routes = [
  {
    path: 'learning',
    canActivate: [authGuard],
    children: [
      {
        path: 'practice',
        loadComponent: () =>
          import('../practice/practice-session.component').then(
            ({ PracticeSessionComponent }) => PracticeSessionComponent,
          ),
      },
      {
        path: 'log',
        loadComponent: () =>
          import('./log-learning/log-learning').then(
            ({ LogLearningComponent }) => LogLearningComponent,
          ),
      },
      {
        path: 'history',
        loadComponent: () =>
          import('../history/learning-history.component').then(
            ({ LearningHistoryComponent }) => LearningHistoryComponent,
          ),
      },
    ],
  },
];
