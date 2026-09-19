import { Component } from '@angular/core';
import { PracticeHomeComponent } from './features/practice/practice-home.component';
import { PracticeSessionComponent } from './features/practice/practice-session.component';

@Component({
  imports: [PracticeHomeComponent, PracticeSessionComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  showPractice = false;

  onStartPractice(): void {
    this.showPractice = true;
  }
}
