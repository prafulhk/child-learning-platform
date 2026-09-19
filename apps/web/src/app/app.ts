import { Component } from '@angular/core';
import { PracticeAttempt } from './core/services/local-storage.service';
import { PracticeAttemptDetailComponent } from './features/practice/practice-attempt-detail.component';
import { PracticeHistoryComponent } from './features/practice/practice-history.component';
import { PracticeHomeComponent } from './features/practice/practice-home.component';
import { PracticeSessionComponent } from './features/practice/practice-session.component';

type AppView = 'HOME' | 'PRACTICE' | 'HISTORY' | 'DETAIL';

@Component({
  imports: [
    PracticeHomeComponent,
    PracticeSessionComponent,
    PracticeHistoryComponent,
    PracticeAttemptDetailComponent,
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

  onViewAttempt(attempt: PracticeAttempt): void {
    this.selectedAttempt = attempt;
    this.view = 'DETAIL';
  }

  onBackToHistory(): void {
    this.view = 'HISTORY';
  }
}
