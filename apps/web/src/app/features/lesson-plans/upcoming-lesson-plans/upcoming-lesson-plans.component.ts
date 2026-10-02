import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ActiveChildService } from '../../../core/services/active-child.service';
import { LessonPlan, LessonPlanApi } from '../../../core/services/lesson-plan-api.service';

@Component({
  selector: 'app-upcoming-lesson-plans',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <header class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900">Upcoming Lesson Plans</h1>
          <p class="mt-1 text-sm text-slate-600">Review planned activities for the selected child.</p>
        </div>

        <a
          routerLink="/lesson-planning/create"
          class="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
          Create Lesson Plan
        </a>
      </header>

      @if (isLoading()) {
        <p class="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">Loading plans...</p>
      } @else if (errorMessage()) {
        <div class="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {{ errorMessage() }}
        </div>
      } @else if (plans().length === 0) {
        <p class="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          No upcoming lesson plans found.
        </p>
      } @else {
        <ul class="space-y-3">
          @for (plan of plans(); track plan._id) {
            <li>
              <a
                class="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow"
                [routerLink]="['/lesson-planning', plan._id]">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <p class="text-sm font-semibold text-slate-900">{{ plan.plannedActivity }}</p>
                    <p class="mt-1 text-xs text-slate-500">{{ formatDate(plan.plannedDate) }}</p>
                  </div>
                  <span class="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                    {{ plan.plannedDurationMinutes }} min
                  </span>
                </div>
              </a>
            </li>
          }
        </ul>
      }
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpcomingLessonPlansComponent implements OnInit {
  private readonly activeChildService = inject(ActiveChildService);
  private readonly lessonPlanApi = inject(LessonPlanApi);

  readonly plans = signal<LessonPlan[]>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    this.loadPlans();
  }

  formatDate(value: string): string {
    return new Date(value).toLocaleDateString();
  }

  private loadPlans(): void {
    const child = this.activeChildService.activeChild();

    if (!child) {
      this.errorMessage.set('Please select a child first to view upcoming lesson plans.');
      this.plans.set([]);
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.lessonPlanApi
      .getLessonPlans({
        childId: child._id,
        status: 'PLANNED',
        page: 1,
        limit: 25,
      })
      .subscribe({
        next: (response) => {
          this.plans.set(response.plans);
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('Unable to load upcoming lesson plans.');
          this.plans.set([]);
          this.isLoading.set(false);
        },
      });
  }
}
