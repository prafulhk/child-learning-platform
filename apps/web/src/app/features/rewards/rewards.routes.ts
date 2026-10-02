import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth-guard';

export const rewardsRoutes: Routes = [
  {
    path: 'rewards',
    canActivate: [authGuard],
    loadComponent: () => import('./rewards-home.component').then(({ RewardsHomeComponent }) => RewardsHomeComponent),
  },
];
