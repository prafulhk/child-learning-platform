import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth-guard';
import { roleGuard } from '../../core/guards/role-guard';

export const parentToolsRoutes: Routes = [
  {
    path: 'parent-tools',
    canActivate: [authGuard, roleGuard(['PARENT'])],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./parent-tools.component').then(
            ({ ParentToolsComponent }) => ParentToolsComponent,
          ),
      },
      {
        path: 'question-bank',
        loadComponent: () =>
          import('../question-bank/question-bank.component').then(
            ({ QuestionBankComponent }) => QuestionBankComponent,
          ),
      },
    ],
  },
  {
    path: 'question-bank',
    pathMatch: 'full',
    redirectTo: 'parent-tools/question-bank',
  },
];
