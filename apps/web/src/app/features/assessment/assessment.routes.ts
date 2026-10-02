import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth-guard';

export const assessmentRoutes: Routes = [
  {
    path: 'assessment',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./assessment-container.component').then(
        ({ AssessmentContainerComponent }) => AssessmentContainerComponent,
      ),
  },
];
