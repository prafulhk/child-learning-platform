import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth-guard';

export const learningJournalRoutes: Routes = [
  {
    path: 'learning-journal',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./learning-journal-home.component').then(
        ({ LearningJournalHomeComponent }) => LearningJournalHomeComponent,
      ),
  },
];
