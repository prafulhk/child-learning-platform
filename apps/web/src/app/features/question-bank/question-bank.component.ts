import { Component, EventEmitter, OnDestroy, OnInit, Output, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { Question } from '../../core/models/question.model';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { OcrService } from '../../core/services/ocr.service';
import { QuestionService } from '../../core/services/question.service';
import { QuestionDisplayComponent } from '../../shared/components/question-display/question-display.component';
import { QuestionFormComponent } from './question-form.component';

type ImportWorkflowStep = 'HIDDEN' | 'SELECT_FILE' | 'OCR_RESULT';

@Component({
  selector: 'app-question-bank',
  standalone: true,
  imports: [QuestionDisplayComponent, QuestionFormComponent],
  templateUrl: './question-bank.component.html',
})
export class QuestionBankComponent implements OnInit, OnDestroy {
  private readonly localStorageService = inject(LocalStorageService);
  private readonly ocrService = inject(OcrService);
  private readonly questionService = inject(QuestionService);
  private ocrSubscription: Subscription | null = null;

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
  readonly isImportProcessing = signal(false);
  readonly importProcessingStatus = signal('');
  readonly importProgressPercent = signal(0);
  readonly ocrExtractedText = signal<string | null>(null);
  readonly ocrErrorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const persistedQuestions = this.localStorageService.getQuestionBankQuestions(this.topicId);

    if (persistedQuestions.length > 0) {
      this.questions.set(persistedQuestions);
      return;
    }

    this.questions.set(this.questionService.getQuestionsByTopic(this.topicId));
  }

  ngOnDestroy(): void {
    this.ocrSubscription?.unsubscribe();
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
    this.resetImportOcrState();
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

    this.resetImportOcrState();

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
    this.resetImportOcrState();
  }

  onContinueImport(): void {
    if (!this.canStartOcr()) {
      return;
    }

    this.startOcrFromSelectedFile();
  }

  onRetryOcr(): void {
    if (!this.canStartOcr()) {
      return;
    }

    this.startOcrFromSelectedFile();
  }

  onBackToImportSelection(): void {
    this.importWorkflowStep.set('SELECT_FILE');
    this.ocrErrorMessage.set(null);
    this.ocrExtractedText.set(null);
    this.importProgressPercent.set(0);
    this.importProcessingStatus.set('');
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
    return this.importWorkflowStep() === 'OCR_RESULT';
  }

  canStartOcr(): boolean {
    return this.hasValidImportFile() && !this.isImportProcessing();
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
    this.resetImportOcrState();
  }

  private resetImportOcrState(): void {
    this.ocrSubscription?.unsubscribe();
    this.ocrSubscription = null;
    this.isImportProcessing.set(false);
    this.importProcessingStatus.set('');
    this.importProgressPercent.set(0);
    this.ocrExtractedText.set(null);
    this.ocrErrorMessage.set(null);
  }

  private startOcrFromSelectedFile(): void {
    const file = this.selectedImportFile();

    if (!file) {
      return;
    }

    this.ocrErrorMessage.set(null);
    this.ocrExtractedText.set(null);
    this.isImportProcessing.set(true);
    this.importProgressPercent.set(0);
    this.importProcessingStatus.set('Reading image...');

    this.ocrSubscription?.unsubscribe();
    this.ocrSubscription = this.ocrService.extractText(file).subscribe({
      next: (update) => {
        this.importProcessingStatus.set(update.status);
        this.importProgressPercent.set(Math.round(update.progress * 100));

        if (update.isComplete) {
          this.ocrExtractedText.set(update.text);
          this.importWorkflowStep.set('OCR_RESULT');
        }
      },
      error: (error) => {
        this.ocrErrorMessage.set(this.getReadableErrorMessage(error));
        this.isImportProcessing.set(false);
      },
      complete: () => {
        this.isImportProcessing.set(false);
      },
    });
  }

  private getReadableErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message.trim().length > 0) {
      return error.message;
    }

    return 'Unable to read text from this image. Please try again.';
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
