import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth-guard';

export const dashboardRoutes: Routes = [
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./dashboard-home/dashboard-home').then(({ DashboardHome }) => DashboardHome),
  },
];
