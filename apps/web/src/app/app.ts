import { Component } from '@angular/core';
import { PracticeAttempt } from './core/services/local-storage.service';
import { PracticeAttemptDetailComponent } from './features/practice/practice-attempt-detail.component';
import { PracticeHistoryComponent } from './features/practice/practice-history.component';
import { PracticeHomeComponent } from './features/practice/practice-home.component';
import { PracticeSessionComponent } from './features/practice/practice-session.component';
import { ParentToolsComponent } from './features/parent-tools/parent-tools.component';
import { QuestionBankComponent } from './features/question-bank/question-bank.component';

type AppView = 'HOME' | 'PRACTICE' | 'HISTORY' | 'DETAIL' | 'PARENT_TOOLS' | 'QUESTION_BANK';

@Component({
  imports: [
    PracticeHomeComponent,
    PracticeSessionComponent,
    PracticeHistoryComponent,
    PracticeAttemptDetailComponent,
    ParentToolsComponent,
    QuestionBankComponent,
  ],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  view: AppView = 'HOME';
  selectedAttempt: PracticeAttempt | null = null;

  onStartPractice(): void {
    this.selectedAttempt = null;
    this.view = 'PRACTICE';
  }

  onViewHistory(): void {
    this.selectedAttempt = null;
    this.view = 'HISTORY';
  }

  onBackToHome(): void {
    this.selectedAttempt = null;
    this.view = 'HOME';
  }

  onOpenParentTools(): void {
    this.selectedAttempt = null;
    this.view = 'PARENT_TOOLS';
  }

  onOpenQuestionBank(): void {
    this.selectedAttempt = null;
    this.view = 'QUESTION_BANK';
  }

  onBackToParentTools(): void {
    this.selectedAttempt = null;
    this.view = 'PARENT_TOOLS';
  }

  onViewAttempt(attempt: PracticeAttempt): void {
    this.selectedAttempt = attempt;
    this.view = 'DETAIL';
  }

  onBackToHistory(): void {
    this.view = 'HISTORY';
  }
}
