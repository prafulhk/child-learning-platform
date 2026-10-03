import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ActiveChildService } from '../../../core/services/active-child.service';
import { ChildService } from '../../../core/services/child.service';
import { CatalogApiService } from '../../../core/services/catalog-api.service';
import { LessonPlan, LessonPlanApi } from '../../../core/services/lesson-plan-api.service';

@Component({
  selector: 'app-lesson-plan-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <div class="mb-5">
        <a
          routerLink="/lesson-planning/upcoming"
          class="inline-flex items-center text-sm font-semibold text-indigo-600 transition hover:text-indigo-500"
        >
          ← Back to Upcoming Lesson Plans
        </a>
      </div>

      @if (isLoading()) {
        <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p class="text-sm text-slate-600">Loading lesson plan...</p>
        </section>
      } @else if (errorMessage()) {
        <section class="rounded-2xl border border-rose-200 bg-rose-50 p-6">
          <h1 class="text-lg font-semibold text-rose-900">Unable to open lesson plan</h1>
          <p class="mt-1 text-sm text-rose-700">{{ errorMessage() }}</p>
          <a
            routerLink="/lesson-planning/upcoming"
            class="mt-4 inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Back to Upcoming Plans
          </a>
        </section>
      } @else if (plan(); as lessonPlan) {
        <section class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <header class="border-b border-slate-100 bg-slate-50 px-5 py-6 sm:px-7">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
                  Lesson Plan
                </p>
                <h1 class="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                  {{ lessonPlan.plannedActivity }}
                </h1>
                @if (childName()) {
                  <p class="mt-2 text-sm text-slate-600">For {{ childName() }}</p>
                }
              </div>

              <span
                class="inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-semibold"
                [class.bg-indigo-50]="lessonPlan.status === 'PLANNED'"
                [class.text-indigo-700]="lessonPlan.status === 'PLANNED'"
                [class.bg-emerald-50]="lessonPlan.status === 'COMPLETED'"
                [class.text-emerald-700]="lessonPlan.status === 'COMPLETED'"
              >
                {{ lessonPlan.status }}
              </span>
            </div>
          </header>

          <div class="grid gap-4 p-5 sm:grid-cols-2 sm:p-7">
            <div class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Date</p>
              <p class="mt-1 font-semibold text-slate-900">{{ formatDate(lessonPlan.plannedDate) }}</p>
            </div>

            <div class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Duration</p>
              <p class="mt-1 font-semibold text-slate-900">{{ lessonPlan.plannedDurationMinutes }} minutes</p>
            </div>

            @if (subjectName()) {
              <div class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Subject</p>
                <p class="mt-1 font-semibold text-slate-900">{{ subjectName() }}</p>
              </div>
            }

            @if (topicName()) {
              <div class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Topic</p>
                <p class="mt-1 font-semibold text-slate-900">{{ topicName() }}</p>
              </div>
            }
          </div>

          @if (lessonPlan.notes) {
            <div class="mx-5 mb-5 rounded-2xl border border-slate-200 p-4 sm:mx-7 sm:mb-7">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Notes</p>
              <p class="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{{ lessonPlan.notes }}</p>
            </div>
          }

          @if (lessonPlan.status === 'PLANNED') {
            <div class="border-t border-slate-100 bg-white px-5 py-5 sm:px-7">
              <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p class="font-semibold text-slate-900">Completed this lesson?</p>
                  <p class="mt-1 text-sm text-slate-500">
                    Record the actual learning session to mark this plan completed.
                  </p>
                </div>

                <a
                  routerLink="/learning/log"
                  [queryParams]="{ lessonPlanId: lessonPlan._id }"
                  class="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-500"
                >
                  Mark as Completed
                </a>
              </div>
            </div>
          } @else if (lessonPlan.status === 'COMPLETED') {
            <div class="border-t border-emerald-100 bg-emerald-50 px-5 py-5 sm:px-7">
              <p class="font-semibold text-emerald-900">Lesson completed</p>
              <p class="mt-1 text-sm text-emerald-700">
                This plan is already linked to a completed learning session.
              </p>
            </div>
          }
        </section>
      }
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonPlanDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly lessonPlanApi = inject(LessonPlanApi);
  private readonly activeChildService = inject(ActiveChildService);
  private readonly childService = inject(ChildService);
  private readonly catalogApi = inject(CatalogApiService);

  readonly plan = signal<LessonPlan | null>(null);
  readonly childName = signal('');
  readonly subjectName = signal('');
  readonly topicName = signal('');
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    const planId = this.route.snapshot.paramMap.get('planId');

    if (!planId) {
      this.isLoading.set(false);
      this.errorMessage.set('Lesson plan not found.');
      return;
    }

    this.lessonPlanApi.getLessonPlanById(planId).subscribe({
      next: (response) => {
        const lessonPlan = response.data ?? response.lessonPlan;

        if (!lessonPlan) {
          this.isLoading.set(false);
          this.errorMessage.set('Lesson plan not found.');
          return;
        }

        this.plan.set(lessonPlan);
        this.resolveChildName(lessonPlan.childId);
        this.loadCatalogNames(lessonPlan);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          error?.error?.message ?? 'Unable to load this lesson plan.',
        );
      },
    });
  }

  formatDate(value: string): string {
    return new Date(value).toLocaleDateString(undefined, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  private resolveChildName(childId: string): void {
    const activeChild = this.activeChildService.activeChild();

    if (activeChild?._id === childId) {
      this.childName.set(activeChild.name);
      return;
    }

    this.childService.getChildren().subscribe({
      next: (response) => {
        const child = response.children.find((item) => item._id === childId);
        if (child) {
          this.childName.set(child.name);
          this.activeChildService.setActiveChild(child);
        }
      },
    });
  }

  private loadCatalogNames(lessonPlan: LessonPlan): void {
    this.catalogApi.getSubjects().subscribe({
      next: (subjects) => {
        const subject = subjects.find((item) => item._id === lessonPlan.subjectId);

        if (!subject) {
          return;
        }

        this.subjectName.set(subject.name);

        this.catalogApi.getTopics(subject._id).subscribe({
          next: (topics) => {
            const topic = topics.find((item) => item._id === lessonPlan.topicId);
            if (topic) {
              this.topicName.set(topic.name);
            }
          },
        });
      },
    });
  }
}
