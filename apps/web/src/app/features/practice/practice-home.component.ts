import { Component, EventEmitter, Output } from '@angular/core';

interface PracticeTopic {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  durationMinutes: number;
  icon: string;
}

@Component({
  selector: 'app-practice-home',
  standalone: true,
  templateUrl: './practice-home.component.html',
})
export class PracticeHomeComponent {
  @Output() startPractice = new EventEmitter<string>();
  @Output() viewHistory = new EventEmitter<void>();

  // Placeholder topics - would be fetched from service
  topics: PracticeTopic[] = [
    {
      id: 'single-digit-addition',
      name: 'Single-Digit Addition',
      description: 'Practice adding numbers 0-9',
      questionCount: 10,
      durationMinutes: 5,
      icon: '➕',
    },
    {
      id: 'single-digit-subtraction',
      name: 'Single-Digit Subtraction',
      description: 'Practice subtracting numbers 0-9',
      questionCount: 10,
      durationMinutes: 5,
      icon: '➖',
    },
    {
      id: 'single-digit-multiplication',
      name: 'Single-Digit Multiplication',
      description: 'Practice multiplying numbers 1-9',
      questionCount: 10,
      durationMinutes: 7,
      icon: '✕',
    },
  ];

  onStartPractice(topicId: string): void {
    this.startPractice.emit(topicId);
  }

  onViewHistory(): void {
    this.viewHistory.emit();
  }
}
