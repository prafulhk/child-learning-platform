import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth-guard';

export const progressRoutes: Routes = [
  {
    path: 'progress',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./progress-home.component').then(
        ({ ProgressHomeComponent }) => ProgressHomeComponent,
      ),
  },
];
