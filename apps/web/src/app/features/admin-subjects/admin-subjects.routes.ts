import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth-guard';
import { roleGuard } from '../../core/guards/role-guard';

export const adminSubjectRoutes: Routes = [
  {
    path: 'admin/subjects',
    canActivate: [authGuard, roleGuard(['ADMIN'])],
    loadComponent: () =>
      import('./admin-subjects.component').then(
        ({ AdminSubjectsComponent }) => AdminSubjectsComponent,
      ),
  },
];
