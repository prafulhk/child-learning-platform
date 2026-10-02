import { describe, expect, it } from 'vitest';

import { routes } from './app.routes';
import { lessonPlanningRoutes } from './features/lesson-plans/lesson-planning.routes';
import { parentToolsRoutes } from './features/parent-tools/parent-tools.routes';

describe('app routes', () => {
  it('defines feature boundary routes for core learning domains', () => {
    expect(routes.some((route) => route.path === 'learning')).toBe(true);
    expect(routes.some((route) => route.path === 'assessment')).toBe(true);
    expect(routes.some((route) => route.path === 'lesson-planning')).toBe(true);
    expect(routes.some((route) => route.path === 'dashboard')).toBe(true);
  });

  it('defines parent-tools boundary and nested question bank route entry', () => {
    expect(routes.some((route) => route.path === 'parent-tools')).toBe(true);
    expect(routes.some((route) => route.path === 'question-bank')).toBe(true);
  });

  it('defines lesson planning route group with create and upcoming routes', () => {
    const lessonPlanningRoute = routes.find((route) => route.path === 'lesson-planning');

    expect(lessonPlanningRoute).toBeDefined();
    expect(lessonPlanningRoute?.children?.some((child) => child.path === 'create')).toBe(true);
    expect(lessonPlanningRoute?.children?.some((child) => child.path === 'upcoming')).toBe(true);
  });

  it('defines lesson planning detail placeholder route', () => {
    const lessonPlanningRoute = routes.find((route) => route.path === 'lesson-planning');

    expect(lessonPlanningRoute?.children?.some((child) => child.path === ':planId')).toBe(true);
  });

  it('defines future feature route placeholders with clear convention', () => {
    expect(routes.some((route) => route.path === 'progress')).toBe(true);
    expect(routes.some((route) => route.path === 'rewards')).toBe(true);
    expect(routes.some((route) => route.path === 'learning-journal')).toBe(true);
  });

  it('redirects unknown routes to dashboard', () => {
    const fallbackRoute = routes.find((route) => route.path === '**');

    expect(fallbackRoute).toBeDefined();
    expect(fallbackRoute?.redirectTo).toBe('dashboard');
  });

  it('keeps legacy lesson-plans redirects for compatibility', () => {
    expect(
      lessonPlanningRoutes.some(
        (route) => route.path === 'lesson-plans' && route.redirectTo === 'lesson-planning',
      ),
    ).toBe(true);

    expect(
      lessonPlanningRoutes.some(
        (route) =>
          route.path === 'lesson-plans/create' && route.redirectTo === 'lesson-planning/create',
      ),
    ).toBe(true);

    expect(
      lessonPlanningRoutes.some(
        (route) =>
          route.path === 'lesson-plans/upcoming' &&
          route.redirectTo === 'lesson-planning/upcoming',
      ),
    ).toBe(true);
  });

  it('keeps legacy question-bank redirect under parent-tools boundary', () => {
    expect(
      parentToolsRoutes.some(
        (route) =>
          route.path === 'question-bank' && route.redirectTo === 'parent-tools/question-bank',
      ),
    ).toBe(true);
  });
});
