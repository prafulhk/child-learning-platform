import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-learning-journal-home',
  standalone: true,
  template: `
    <main class="app-page-shell app-page-shell--standard">
      <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 class="text-2xl font-bold text-slate-900">Learning Journal</h1>
        <p class="mt-2 text-sm text-slate-600">
          Journal entries and reflections will be added in a future milestone.
        </p>
      </section>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearningJournalHomeComponent {}
