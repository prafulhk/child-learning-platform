import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth-guard';

export const lessonPlanningRoutes: Routes = [
  {
    path: 'lesson-planning',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'upcoming',
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./create-lesson-plan/create-lesson-plan').then(
            ({ CreateLessonPlan }) => CreateLessonPlan,
          ),
      },
      {
        path: 'upcoming',
        loadComponent: () =>
          import('./upcoming-lesson-plans/upcoming-lesson-plans.component').then(
            ({ UpcomingLessonPlansComponent }) => UpcomingLessonPlansComponent,
          ),
      },
      {
        path: ':planId',
        loadComponent: () =>
          import('./lesson-plan-detail-placeholder/lesson-plan-detail-placeholder.component').then(
            ({ LessonPlanDetailPlaceholderComponent }) => LessonPlanDetailPlaceholderComponent,
          ),
      },
    ],
  },
  {
    path: 'lesson-plans',
    pathMatch: 'full',
    redirectTo: 'lesson-planning',
  },
  {
    path: 'lesson-plans/create',
    pathMatch: 'full',
    redirectTo: 'lesson-planning/create',
  },
  {
    path: 'lesson-plans/upcoming',
    pathMatch: 'full',
    redirectTo: 'lesson-planning/upcoming',
  },
  {
    path: 'lesson-plans/:planId',
    redirectTo: 'lesson-planning/:planId',
  },
];
