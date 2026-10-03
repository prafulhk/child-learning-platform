import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ActiveChildService } from '../../../core/services/active-child.service';
import { Child, ChildService } from '../../../core/services/child.service';
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
          <p class="mt-1 text-sm text-slate-600">
            Review what is planned next for your child.
          </p>
        </div>

        <a
          routerLink="/lesson-planning/create"
          class="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          Create Lesson Plan
        </a>
      </header>

      @if (isLoadingChildren()) {
        <section class="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-sm text-slate-600">Loading children...</p>
        </section>
      } @else if (childrenErrorMessage()) {
        <section class="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {{ childrenErrorMessage() }}
        </section>
      } @else if (children().length === 0) {
        <section class="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="font-semibold text-slate-900">No child profile found.</p>
          <p class="mt-1 text-sm text-slate-600">
            Add a child from Parent Tools before viewing upcoming lesson plans.
          </p>
          <a
            routerLink="/parent-tools"
            class="mt-4 inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Manage Children
          </a>
        </section>
      } @else {
        <section class="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <label for="upcoming-child" class="block text-sm font-semibold text-slate-900">
                Child
              </label>
              <p class="mt-1 text-xs text-slate-500">
                Choose whose upcoming lesson plans you want to see.
              </p>
            </div>

            <select
              id="upcoming-child"
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:max-w-sm"
              [value]="selectedChildId()"
              (change)="onChildChange($event)"
            >
              <option value="">Select a child</option>
              @for (child of children(); track child._id) {
                <option [value]="child._id">{{ child.name }}</option>
              }
            </select>
          </div>
        </section>

        @if (!selectedChildId()) {
          <section class="rounded-2xl border border-indigo-100 bg-indigo-50 p-5 text-sm text-indigo-800">
            Select a child to view upcoming lesson plans.
          </section>
        } @else if (isLoading()) {
          <p class="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
            Loading plans...
          </p>
        } @else if (errorMessage()) {
          <div class="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {{ errorMessage() }}
          </div>
        } @else if (plans().length === 0) {
          <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p class="font-semibold text-slate-900">No upcoming lesson plans found.</p>
            <p class="mt-1 text-sm text-slate-600">
              There are no planned activities scheduled for this child from today onward.
            </p>
          </section>
        } @else {
          <div class="mb-3 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-slate-900">Upcoming</h2>
            <span class="text-xs font-medium text-slate-500">{{ plans().length }} plan{{ plans().length === 1 ? '' : 's' }}</span>
          </div>

          <ul class="space-y-3">
            @for (plan of plans(); track plan._id) {
              <li>
                <a
                  class="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                  [routerLink]="['/lesson-planning', plan._id]"
                >
                  <div class="flex items-start justify-between gap-4">
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-slate-900">{{ plan.plannedActivity }}</p>
                      <p class="mt-1 text-sm text-slate-600">{{ formatDate(plan.plannedDate) }}</p>
                      @if (plan.notes) {
                        <p class="mt-2 line-clamp-2 text-xs text-slate-500">{{ plan.notes }}</p>
                      }
                    </div>
                    <span
                      class="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700"
                    >
                      {{ plan.plannedDurationMinutes }} min
                    </span>
                  </div>
                </a>
              </li>
            }
          </ul>
        }
      }
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpcomingLessonPlansComponent implements OnInit {
  private readonly activeChildService = inject(ActiveChildService);
  private readonly childService = inject(ChildService);
  private readonly lessonPlanApi = inject(LessonPlanApi);

  readonly children = signal<Child[]>([]);
  readonly selectedChildId = signal('');
  readonly plans = signal<LessonPlan[]>([]);
  readonly isLoadingChildren = signal(false);
  readonly isLoading = signal(false);
  readonly childrenErrorMessage = signal('');
  readonly errorMessage = signal('');

  ngOnInit(): void {
    this.loadChildren();
  }

  formatDate(value: string): string {
    return new Date(value).toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  onChildChange(event: Event): void {
    const childId = (event.target as HTMLSelectElement).value;
    const child = this.children().find((item) => item._id === childId);

    this.selectedChildId.set(childId);
    this.plans.set([]);
    this.errorMessage.set('');

    if (!child) {
      this.activeChildService.clearActiveChild();
      return;
    }

    this.activeChildService.setActiveChild(child);
    this.loadPlans(child);
  }

  private loadChildren(): void {
    this.isLoadingChildren.set(true);
    this.childrenErrorMessage.set('');

    this.childService.getChildren().subscribe({
      next: (response) => {
        const children = response.children;
        this.children.set(children);
        this.isLoadingChildren.set(false);

        const activeChild = this.activeChildService.activeChild();
        const activeChildFromResponse = activeChild
          ? children.find((child) => child._id === activeChild._id)
          : undefined;

        if (activeChildFromResponse) {
          this.selectedChildId.set(activeChildFromResponse._id);
          this.loadPlans(activeChildFromResponse);
          return;
        }

        if (children.length === 1) {
          this.selectedChildId.set(children[0]._id);
          this.activeChildService.setActiveChild(children[0]);
          this.loadPlans(children[0]);
        }
      },
      error: () => {
        this.childrenErrorMessage.set('Unable to load child profiles.');
        this.isLoadingChildren.set(false);
      },
    });
  }

  private loadPlans(child: Child): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.lessonPlanApi
      .getLessonPlans({
        childId: child._id,
        fromDate: this.getTodayLocalMidnightIso(),
        status: 'PLANNED',
        page: 1,
        limit: 25,
      })
      .subscribe({
        next: (response) => {
          const plans = [...response.plans].sort(
            (first, second) =>
              new Date(first.plannedDate).getTime() - new Date(second.plannedDate).getTime(),
          );

          this.plans.set(plans);
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('Unable to load upcoming lesson plans.');
          this.plans.set([]);
          this.isLoading.set(false);
        },
      });
  }

  private getTodayLocalMidnightIso(): string {
    const today = new Date();

    return new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    ).toISOString();
  }
}
