import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
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
  templateUrl: './question-form.component.html',
})
export class QuestionFormComponent implements OnInit {
  private _question: Question | null = null;

  @Output() save = new EventEmitter<Question>();
  @Output() cancel = new EventEmitter<void>();

  @Input()
  set question(value: Question | null) {
    this._question = value;
    this.initializeForm(value);
  }

  get question(): Question | null {
    return this._question;
  }

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

  get isEditMode(): boolean {
    return this._question !== null;
  }

  get titleLabel(): string {
    return this.isEditMode ? 'Edit Question' : 'Create Question';
  }

  ngOnInit(): void {
    if (this.rows.length === 0 && this.options.length === 0) {
      this.initializeForm(this._question);
    }
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

    const currentQuestion = this._question;

    this.save.emit({
      id: currentQuestion?.id ?? this.generateId('question'),
      type: 'SIMPLE_ARITHMETIC',
      subjectId: this.subjectId,
      topicId: this.topicId,
      difficulty: this.difficulty,
      rows: parsedRows,
      options: parsedOptions,
      correctOptionId,
      explanation: this.explanation.trim() || undefined,
      createdAt: currentQuestion?.createdAt ?? new Date().toISOString(),
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

    const selected = this.parsedOptions.find(
      (option) => option.id === this.selectedCorrectOptionId,
    );
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
    return (
      this.selectedCorrectOptionId !== null &&
      this.parsedOptions.some((option) => option.id === this.selectedCorrectOptionId)
    );
  }

  get previewQuestion() {
    if (
      this.parsedRows.some((row) => Number.isNaN(row.value)) ||
      this.parsedOptions.some((option) => Number.isNaN(option.value))
    ) {
      return null;
    }

    return {
      id: this._question?.id ?? 'preview-question',
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
    const randomId =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
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

  private initializeForm(question: Question | null): void {
    this.submitted = false;
    this.validationErrors.set([]);

    if (!question) {
      this.difficulty = 'EASY';
      this.explanation = '';
      this.rows = [
        { value: '1', operator: '' },
        { value: '1', operator: '' },
        { value: '1', operator: '' },
      ];
      this.options = this.createDefaultOptions();
      this.selectedCorrectOptionId = this.options[0]?.id ?? null;
      return;
    }

    this.difficulty = question.difficulty;
    this.explanation = question.explanation ?? '';
    this.rows = question.rows.map((row, index) => ({
      value: row.value,
      operator: index === 0 ? '' : (row.operator ?? ''),
    }));
    this.options = question.options.map((option) => ({
      id: option.id,
      value: option.value,
    }));
    this.selectedCorrectOptionId = question.correctOptionId;
  }
}
