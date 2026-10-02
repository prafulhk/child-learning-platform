import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-lesson-plan-detail-placeholder',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Lesson Plan Detail</h1>
        <p class="mt-2 text-sm text-slate-600">
          Placeholder route for plan detail. Full detail experience will be added in a future story.
        </p>

        <p class="mt-4 text-xs text-slate-500">Plan ID: {{ planId }}</p>

        <div class="mt-6 flex flex-wrap gap-3">
          <a
            routerLink="/lesson-planning/upcoming"
            class="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Back to Upcoming Plans
          </a>
          <a
            routerLink="/lesson-planning/create"
            class="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500">
            Create New Plan
          </a>
        </div>
      </section>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonPlanDetailPlaceholderComponent {
  private readonly route = inject(ActivatedRoute);

  readonly planId = this.route.snapshot.paramMap.get('planId') ?? '';
}
