import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { Question } from '../../core/models/question.model';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { QuestionService } from '../../core/services/question.service';
import { QuestionDisplayComponent } from '../../shared/components/question-display/question-display.component';
import { QuestionFormComponent } from './question-form.component';

@Component({
  selector: 'app-question-bank',
  standalone: true,
  imports: [QuestionDisplayComponent, QuestionFormComponent],
  templateUrl: './question-bank.component.html',
})
export class QuestionBankComponent implements OnInit {
  private readonly localStorageService = inject(LocalStorageService);
  private readonly questionService = inject(QuestionService);

  @Output() backToParentTools = new EventEmitter<void>();

  readonly subjectLabel = 'Abacus';
  readonly topicLabel = 'Single-Digit Addition';
  readonly topicId = 'single-digit-addition';
  readonly questions = signal<Question[]>([]);
  readonly activeQuestion = signal<Question | null>(null);
  readonly isFormVisible = signal(false);

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
    this.isFormVisible.set(true);
  }

  onEditQuestion(question: Question): void {
    this.activeQuestion.set(this.cloneQuestion(question));
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

  onDeleteQuestion(_: Question): void {}

  onBackToParentTools(): void {
    this.backToParentTools.emit();
  }

  trackByQuestionId(_: number, question: Question): string {
    return question.id;
  }

  private closeForm(): void {
    this.activeQuestion.set(null);
    this.isFormVisible.set(false);
  }

  private cloneQuestion(question: Question): Question {
    return JSON.parse(JSON.stringify(question)) as Question;
  }
}
