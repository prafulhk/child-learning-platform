import { Component } from '@angular/core';
import { PracticeHistoryComponent } from './features/practice/practice-history.component';
import { PracticeHomeComponent } from './features/practice/practice-home.component';
import { PracticeSessionComponent } from './features/practice/practice-session.component';

type AppView = 'HOME' | 'PRACTICE' | 'HISTORY';

@Component({
  imports: [PracticeHomeComponent, PracticeSessionComponent, PracticeHistoryComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  view: AppView = 'HOME';

  onStartPractice(): void {
    this.view = 'PRACTICE';
  }

  onViewHistory(): void {
    this.view = 'HISTORY';
  }

  onBackToHome(): void {
    this.view = 'HOME';
  }
}
