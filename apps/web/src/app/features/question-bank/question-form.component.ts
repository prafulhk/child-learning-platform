import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Question } from '../../core/models/question.model';
import { QuestionDisplayComponent } from '../../shared/components/question-display/question-display.component';

interface QuestionRowDraft {
  value: string | number;
  operator: '' | '-';
}

interface QuestionOptionDraft {
  id: string;
  value: string | number;
}

@Component({
  selector: 'app-question-form',
  standalone: true,
  imports: [FormsModule, QuestionDisplayComponent],
  template: `
    <section class="mx-auto w-full max-w-4xl px-4 py-6">
      <header class="text-center">
        <h1 class="text-3xl font-bold text-slate-900">Create Question</h1>
      </header>

      @if (submitted && validationErrors().length > 0) {
      <div class="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
        <ul class="list-disc space-y-1 pl-5">
          @for (error of validationErrors(); track error) {
          <li>{{ error }}</li>
          }
        </ul>
      </div>
      }

      <div class="mt-6 grid gap-4">
        <div class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div class="grid gap-4 md:grid-cols-3">
            <div>
              <p class="text-sm font-medium text-slate-600">Subject</p>
              <p class="mt-1 text-base font-semibold text-slate-900">{{ subjectLabel }}</p>
            </div>

            <div>
              <p class="text-sm font-medium text-slate-600">Topic</p>
              <p class="mt-1 text-base font-semibold text-slate-900">{{ topicLabel }}</p>
            </div>

            <label class="block">
              <span class="text-sm font-medium text-slate-600">Difficulty</span>
              <select [(ngModel)]="difficulty" data-testid="difficulty-select"
                class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                @for (option of difficultyOptions; track option.value) {
                <option [ngValue]="option.value">{{ option.label }}</option>
                }
              </select>
            </label>
          </div>
        </div>

        <div class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div class="flex items-center justify-between gap-3">
            <h2 class="text-lg font-semibold text-slate-900">Rows</h2>
            <button type="button"
              class="min-h-11 rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              (click)="addRow()">
              + Add Row
            </button>
          </div>

          <div class="mt-4 space-y-3">
            @for (row of rows; track trackByRow($index); let index = $index) {
            <div class="grid gap-3 md:grid-cols-[1fr_12rem] md:items-end">
              <label class="block">
                <span class="text-sm font-medium text-slate-600">Row {{ index + 1 }} value</span>
                <input [(ngModel)]="row.value" type="number" inputmode="numeric"
                  class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </label>

              @if (index > 0) {
              <label class="block">
                <span class="text-sm font-medium text-slate-600">Operator</span>
                <select [(ngModel)]="row.operator" data-testid="row-operator"
                  class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Add</option>
                  <option value="-">Subtract</option>
                </select>
              </label>
              } @else {
              <div class="rounded-xl bg-slate-50 px-3 py-3 text-sm text-slate-500 ring-1 ring-slate-200">
                First row has no operator.
              </div>
              }
            </div>
            }
          </div>
        </div>

        <div class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <h2 class="text-lg font-semibold text-slate-900">Options</h2>
          <div class="mt-4 grid gap-3 md:grid-cols-2">
            @for (option of options; track trackByOption($index); let index = $index) {
            <label class="block rounded-xl border border-slate-200 p-3">
              <span class="text-sm font-medium text-slate-600">Option {{ index + 1 }}</span>
              <input [(ngModel)]="option.value" type="number" inputmode="numeric" data-testid="option-input"
                class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </label>
            }
          </div>

          <div class="mt-5">
            <p class="text-sm font-medium text-slate-600">Correct Answer</p>
            <div class="mt-2 grid gap-2 md:grid-cols-2">
              @for (option of options; track option.id; let index = $index) {
              <label class="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
                <input type="radio" name="correct-option" [value]="option.id" [(ngModel)]="selectedCorrectOptionId"
                  class="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span class="text-base font-medium text-slate-900">{{ option.value || '0' }}</span>
              </label>
              }
            </div>
          </div>
        </div>

        <div class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <label class="block">
            <span class="text-sm font-medium text-slate-600">Explanation</span>
            <textarea [(ngModel)]="explanation" rows="4"
              class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </label>
        </div>

        @if (previewQuestion) {
        <div class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <h2 class="text-lg font-semibold text-slate-900">Preview</h2>
          <div class="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <app-question-display [question]="previewQuestion"></app-question-display>
          </div>
        </div>
        }

        <div class="flex flex-col gap-3 sm:flex-row">
          <button type="button"
            class="min-h-11 flex-1 rounded-xl bg-blue-600 px-4 py-3 text-base font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            (click)="onSave()">
            Save Question
          </button>
          <button type="button"
            class="min-h-11 flex-1 rounded-xl bg-slate-800 px-4 py-3 text-base font-semibold text-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            (click)="onCancel()">
            Cancel
          </button>
        </div>
      </div>
    </section>
  `,
})
export class QuestionFormComponent implements OnInit {
  @Output() save = new EventEmitter<Question>();
  @Output() cancel = new EventEmitter<void>();

  readonly subjectLabel = 'Abacus';
  readonly topicLabel = 'Single-Digit Addition';
  readonly difficultyOptions = [
    { label: 'Easy', value: 'EASY' as const },
    { label: 'Medium', value: 'MEDIUM' as const },
    { label: 'Hard', value: 'HARD' as const },
  ];

  readonly subjectId = 'abacus';
  readonly topicId = 'single-digit-addition';

  difficulty: Question['difficulty'] = 'EASY';
  explanation = '';
  rows: QuestionRowDraft[] = [];
  options: QuestionOptionDraft[] = [];
  selectedCorrectOptionId: string | null = null;

  submitted = false;
  validationErrors = signal<string[]>([]);

  ngOnInit(): void {
    this.rows = [
      { value: '1', operator: '' },
      { value: '1', operator: '' },
      { value: '1', operator: '' },
    ];

    this.options = this.createDefaultOptions();
    this.selectedCorrectOptionId = this.options[0]?.id ?? null;
  }

  addRow(): void {
    this.rows = [...this.rows, { value: '1', operator: '' }];
  }

  onSave(): void {
    this.submitted = true;

    const validationErrors = this.getValidationErrors();
    this.validationErrors.set(validationErrors);

    if (validationErrors.length > 0) {
      return;
    }

    const parsedRows = this.rows.map((row, index) => ({
      value: Number(row.value),
      ...(index === 0 ? {} : row.operator === '-' ? { operator: '-' as const } : {}),
    }));

    const parsedOptions = this.options.map((option) => ({
      id: option.id,
      value: Number(option.value),
    }));

    const correctOptionId = this.selectedCorrectOptionId ?? '';

    this.save.emit({
      id: this.generateId('question'),
      type: 'SIMPLE_ARITHMETIC',
      subjectId: this.subjectId,
      topicId: this.topicId,
      difficulty: this.difficulty,
      rows: parsedRows,
      options: parsedOptions,
      correctOptionId,
      explanation: this.explanation.trim() || undefined,
      createdAt: new Date().toISOString(),
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }

  setCorrectOption(optionId: string): void {
    this.selectedCorrectOptionId = optionId;
  }

  get parsedRows(): Array<{ value: number; operator?: '-' }> {
    return this.rows.map((row, index) => ({
      value: this.toNumber(row.value),
      ...(index > 0 && row.operator === '-' ? { operator: '-' as const } : {}),
    }));
  }

  get parsedOptions(): Array<{ id: string; value: number }> {
    return this.options.map((option) => ({
      id: option.id,
      value: this.toNumber(option.value),
    }));
  }

  get correctOptionValue(): number | null {
    if (!this.selectedCorrectOptionId) {
      return null;
    }

    const selected = this.parsedOptions.find((option) => option.id === this.selectedCorrectOptionId);
    return selected?.value ?? null;
  }

  get arithmeticAnswer(): number | null {
    const values = this.parsedRows;

    if (values.length < 3 || values.some((row) => Number.isNaN(row.value))) {
      return null;
    }

    let total = values[0].value;

    for (const row of values.slice(1)) {
      total = row.operator === '-' ? total - row.value : total + row.value;
    }

    return total;
  }

  get hasFirstRowMinus(): boolean {
    return this.rows[0]?.operator === '-';
  }

  get optionValuesAreUnique(): boolean {
    const values = this.parsedOptions.map((option) => option.value);
    return new Set(values).size === values.length;
  }

  get selectedCorrectOptionExists(): boolean {
    return this.selectedCorrectOptionId !== null && this.parsedOptions.some((option) => option.id === this.selectedCorrectOptionId);
  }

  get previewQuestion() {
    if (this.parsedRows.some((row) => Number.isNaN(row.value)) || this.parsedOptions.some((option) => Number.isNaN(option.value))) {
      return null;
    }

    return {
      id: 'preview-question',
      type: 'SIMPLE_ARITHMETIC' as const,
      subjectId: this.subjectId,
      topicId: this.topicId,
      difficulty: this.difficulty,
      rows: this.parsedRows,
      options: this.parsedOptions,
      correctOptionId: this.selectedCorrectOptionId ?? this.parsedOptions[0]?.id ?? '',
      createdAt: new Date().toISOString(),
    };
  }

  getValidationErrors(): string[] {
    const errors: string[] = [];

    if (this.rows.length < 3) {
      errors.push('Please add at least 3 rows.');
    }

    if (this.rows.some((row) => !this.isValidNumber(row.value))) {
      errors.push('Every row must contain a valid number.');
    }

    if (this.hasFirstRowMinus) {
      errors.push('The first row cannot use a subtraction operator.');
    }

    if (this.options.length !== 4) {
      errors.push('Exactly 4 options are required.');
    }

    if (this.options.some((option) => !this.isValidNumber(option.value))) {
      errors.push('Every option must contain a valid number.');
    }

    if (!this.optionValuesAreUnique) {
      errors.push('Option values must be unique.');
    }

    if (!this.selectedCorrectOptionId) {
      errors.push('Select one correct answer.');
    }

    if (!this.selectedCorrectOptionExists) {
      errors.push('Select a valid correct answer.');
    }

    const answer = this.arithmeticAnswer;
    const selectedValue = this.correctOptionValue;

    if (answer === null) {
      errors.push('Enter valid row values before saving.');
    } else if (selectedValue !== null && answer !== selectedValue) {
      errors.push('The correct answer must match the arithmetic result.');
    }

    return errors;
  }

  trackByRow(index: number): number {
    return index;
  }

  trackByOption(index: number): number {
    return index;
  }

  private isValidNumber(value: string | number): boolean {
    return this.isNumericValue(value);
  }

  private toNumber(value: string | number): number {
    return Number(value);
  }

  private isNumericValue(value: string | number): boolean {
    return String(value).trim().length > 0 && Number.isFinite(Number(value));
  }

  private generateId(prefix: string): string {
    const randomId = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    return `${prefix}-${randomId}`;
  }

  private createDefaultOptions(): QuestionOptionDraft[] {
    return [
      { id: this.generateId('option'), value: '3' },
      { id: this.generateId('option'), value: '4' },
      { id: this.generateId('option'), value: '5' },
      { id: this.generateId('option'), value: '6' },
    ];
  }
}
