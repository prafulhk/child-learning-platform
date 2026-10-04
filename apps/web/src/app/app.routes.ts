import { Routes } from '@angular/router';
import { adminSubjectRoutes } from './features/admin-subjects/admin-subjects.routes';
import { assessmentRoutes } from './features/assessment/assessment.routes';
import { authRoutes } from './features/auth/auth.routes';
import { dashboardRoutes } from './features/dashboard/dashboard.routes';
import { learningJournalRoutes } from './features/learning-journal/learning-journal.routes';
import { learningRoutes } from './features/learning/learning.routes';
import { lessonPlanningRoutes } from './features/lesson-plans/lesson-planning.routes';
import { parentToolsRoutes } from './features/parent-tools/parent-tools.routes';
import { profileRoutes } from './features/profile/profile.routes';
import { progressRoutes } from './features/progress/progress.routes';
import { rewardsRoutes } from './features/rewards/rewards.routes';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  ...authRoutes,
  ...dashboardRoutes,
  ...learningRoutes,
  ...lessonPlanningRoutes,
  ...assessmentRoutes,
  ...adminSubjectRoutes,
  ...parentToolsRoutes,
  ...profileRoutes,
  ...progressRoutes,
  ...rewardsRoutes,
  ...learningJournalRoutes,
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
