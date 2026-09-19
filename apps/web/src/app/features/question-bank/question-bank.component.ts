import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { Question } from '../../core/models/question.model';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { QuestionService } from '../../core/services/question.service';
import { QuestionDisplayComponent } from '../../shared/components/question-display/question-display.component';
import { QuestionFormComponent } from './question-form.component';

type ImportWorkflowStep = 'HIDDEN' | 'SELECT_FILE' | 'READY_FOR_EXTRACTION';

@Component({
  selector: 'app-question-bank',
  standalone: true,
  imports: [QuestionDisplayComponent, QuestionFormComponent],
  templateUrl: './question-bank.component.html',
})
export class QuestionBankComponent implements OnInit {
  private readonly localStorageService = inject(LocalStorageService);
  private readonly questionService = inject(QuestionService);

  readonly importAcceptedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/heic',
    'application/pdf',
  ] as const;
  readonly importAcceptedFileTypes = this.importAcceptedMimeTypes.join(',');
  readonly maxImportFileSizeBytes = 10 * 1024 * 1024;

  @Output() backToParentTools = new EventEmitter<void>();

  readonly subjectLabel = 'Abacus';
  readonly topicLabel = 'Single-Digit Addition';
  readonly topicId = 'single-digit-addition';
  readonly questions = signal<Question[]>([]);
  readonly activeQuestion = signal<Question | null>(null);
  readonly isFormVisible = signal(false);
  readonly importWorkflowStep = signal<ImportWorkflowStep>('HIDDEN');
  readonly selectedImportFile = signal<File | null>(null);
  readonly importValidationMessage = signal<string | null>(null);

  ngOnInit(): void {
    const persistedQuestions = this.localStorageService.getQuestionBankQuestions(this.topicId);

    if (persistedQuestions.length > 0) {
      this.questions.set(persistedQuestions);
      return;
    }

    this.questions.set(this.questionService.getQuestionsByTopic(this.topicId));
  }

  onAddQuestion(): void {
    this.activeQuestion.set(null);
    this.resetImportWorkflow();
    this.isFormVisible.set(true);
  }

  onOpenImportQuestions(): void {
    this.closeForm();
    this.selectedImportFile.set(null);
    this.importValidationMessage.set(null);
    this.importWorkflowStep.set('SELECT_FILE');
  }

  onEditQuestion(question: Question): void {
    this.activeQuestion.set(this.cloneQuestion(question));
    this.resetImportWorkflow();
    this.isFormVisible.set(true);
  }

  onSaveQuestion(question: Question): void {
    const editingQuestion = this.activeQuestion();
    let nextQuestions: Question[];

    if (editingQuestion === null) {
      nextQuestions = [question, ...this.questions()];
    } else {
      nextQuestions = this.questions().map((currentQuestion) =>
        currentQuestion.id === editingQuestion.id ? question : currentQuestion,
      );
    }

    this.questions.set(nextQuestions);
    this.localStorageService.saveQuestionBankQuestions(this.topicId, nextQuestions);

    this.closeForm();
  }

  onCancelQuestionForm(): void {
    this.closeForm();
  }

  onImportFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0) ?? null;

    if (file === null) {
      this.selectedImportFile.set(null);
      this.importValidationMessage.set(null);
      return;
    }

    if (
      !this.importAcceptedMimeTypes.includes(
        file.type as (typeof this.importAcceptedMimeTypes)[number],
      )
    ) {
      this.selectedImportFile.set(null);
      this.importValidationMessage.set('Choose a JPEG, PNG, HEIC, or PDF file.');
      input.value = '';
      return;
    }

    if (file.size > this.maxImportFileSizeBytes) {
      this.selectedImportFile.set(null);
      this.importValidationMessage.set(
        `Choose a file smaller than ${this.formatFileSize(this.maxImportFileSizeBytes)}.`,
      );
      input.value = '';
      return;
    }

    this.selectedImportFile.set(file);
    this.importValidationMessage.set(null);
    input.value = '';
  }

  onClearImportFile(): void {
    this.selectedImportFile.set(null);
    this.importValidationMessage.set(null);
  }

  onContinueImport(): void {
    if (!this.hasValidImportFile()) {
      return;
    }

    this.importWorkflowStep.set('READY_FOR_EXTRACTION');
  }

  onBackToImportSelection(): void {
    this.importWorkflowStep.set('SELECT_FILE');
  }

  onBackToQuestionBank(): void {
    this.resetImportWorkflow();
  }

  onDeleteQuestion(_: Question): void {}

  onBackToParentTools(): void {
    this.resetImportWorkflow();
    this.closeForm();
    this.backToParentTools.emit();
  }

  hasValidImportFile(): boolean {
    return this.selectedImportFile() !== null && this.importValidationMessage() === null;
  }

  isImportVisible(): boolean {
    return this.importWorkflowStep() !== 'HIDDEN';
  }

  isReadyForExtraction(): boolean {
    return this.importWorkflowStep() === 'READY_FOR_EXTRACTION';
  }

  getSelectedImportFileType(): string {
    return this.selectedImportFile()?.type ?? '';
  }

  getSelectedImportFileSizeLabel(): string {
    const file = this.selectedImportFile();
    return file ? this.formatFileSize(file.size) : '';
  }

  trackByQuestionId(_: number, question: Question): string {
    return question.id;
  }

  private closeForm(): void {
    this.activeQuestion.set(null);
    this.isFormVisible.set(false);
  }

  private resetImportWorkflow(): void {
    this.importWorkflowStep.set('HIDDEN');
    this.selectedImportFile.set(null);
    this.importValidationMessage.set(null);
  }

  private formatFileSize(sizeInBytes: number): string {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`;
    }

    const sizeInKilobytes = sizeInBytes / 1024;

    if (sizeInKilobytes < 1024) {
      return `${Math.round(sizeInKilobytes)} KB`;
    }

    return `${(sizeInKilobytes / 1024).toFixed(1)} MB`;
  }

  private cloneQuestion(question: Question): Question {
    return JSON.parse(JSON.stringify(question)) as Question;
  }
}
