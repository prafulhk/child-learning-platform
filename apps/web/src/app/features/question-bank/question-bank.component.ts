import { Component, OnInit, inject, signal } from '@angular/core';
import { Question } from '../../core/models/question.model';
import { QuestionService } from '../../core/services/question.service';
import { QuestionDisplayComponent } from '../../shared/components/question-display/question-display.component';

@Component({
  selector: 'app-question-bank',
  standalone: true,
  imports: [QuestionDisplayComponent],
  template: `
    <section class="mx-auto w-full max-w-5xl px-4 py-6">
      <header class="text-center">
        <h1 class="text-3xl font-bold text-slate-900">Question Bank</h1>
        <div
          class="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-slate-600"
        >
          <span class="rounded-full bg-slate-100 px-3 py-1">{{ subjectLabel }}</span>
          <span class="rounded-full bg-slate-100 px-3 py-1">{{ topicLabel }}</span>
        </div>
      </header>

      @if (questions().length === 0) {
        <div class="mt-6 rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
          <p class="text-base font-medium text-slate-600">No questions in the Question Bank yet.</p>
        </div>
      } @else {
        <div class="mt-6 grid gap-4">
          @for (
            question of questions();
            track trackByQuestionId($index, question);
            let index = $index
          ) {
            <article class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 class="text-lg font-semibold text-slate-900">Question {{ index + 1 }}</h2>
                  <p class="mt-1 text-sm font-medium text-slate-600" data-testid="question-id">
                    ID: {{ question.id }}
                  </p>
                </div>

                <div class="flex flex-wrap gap-2 text-xs font-semibold">
                  <span
                    class="rounded-full bg-slate-100 px-3 py-1 text-slate-700"
                    data-testid="question-topic"
                  >
                    {{ topicLabel }}
                  </span>
                  <span
                    class="rounded-full bg-slate-100 px-3 py-1 text-slate-700"
                    data-testid="question-difficulty"
                  >
                    {{ question.difficulty }}
                  </span>
                  <span
                    class="rounded-full bg-slate-100 px-3 py-1 text-slate-700"
                    data-testid="question-row-count"
                  >
                    {{ question.rows.length }} rows
                  </span>
                </div>
              </div>

              <div class="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <app-question-display [question]="question"></app-question-display>
              </div>

              <div class="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  class="min-h-11 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Add Question
                </button>
                <button
                  type="button"
                  class="min-h-11 rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                >
                  Edit
                </button>
                <button
                  type="button"
                  class="min-h-11 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                >
                  Delete
                </button>
              </div>
            </article>
          }
        </div>
      }
    </section>
  `,
})
export class QuestionBankComponent implements OnInit {
  private readonly questionService = inject(QuestionService);

  readonly subjectLabel = 'Abacus';
  readonly topicLabel = 'Single-Digit Addition';
  readonly topicId = 'single-digit-addition';
  readonly questions = signal<Question[]>([]);

  ngOnInit(): void {
    this.questions.set(this.questionService.getQuestionsByTopic(this.topicId));
  }

  trackByQuestionId(_: number, question: Question): string {
    return question.id;
  }
}
