import { Component, inject } from '@angular/core';
import { LocalStorageService, PracticeAttempt } from '../../core/services/local-storage.service';
import type { AssessmentAttempt } from '../../core/models/assessment.model';
import { CommonModule, DatePipe } from '@angular/common';

type HistoryActivityType = 'Practice' | 'Olympiad';

interface LearningHistoryItem {
  id: string;
  type: HistoryActivityType;
  title: string;
  startedAt: string;
  completedAt: string;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  accuracyPercentage: number;
}

@Component({
  selector: 'app-learning-history',
  standalone: true,
  templateUrl: './learning-history.component.html',
  imports: [CommonModule],
})
export class LearningHistoryComponent {
  private readonly localStorageService = inject(LocalStorageService);

  historyItems: LearningHistoryItem[] = [];

  constructor() {
    this.loadHistory();
  }

  private loadHistory(): void {
    const practiceAttempts = this.localStorageService.getCompletedAttempts();

    const assessmentAttempts = this.localStorageService.getCompletedAssessmentAttempts();

    const practiceHistory = practiceAttempts.map((attempt) => this.mapPracticeAttempt(attempt));

    const assessmentHistory = assessmentAttempts.map((attempt) =>
      this.mapAssessmentAttempt(attempt),
    );

    this.historyItems = [...practiceHistory, ...assessmentHistory].sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    );
  }

  private mapPracticeAttempt(attempt: PracticeAttempt): LearningHistoryItem {
    return {
      id: attempt.id,
      type: 'Practice',
      title: `Practice - ${attempt.topicId}`,
      startedAt: attempt.startedAt,
      completedAt: attempt.completedAt,
      totalQuestions: attempt.result.totalQuestions,
      correctCount: attempt.result.correctCount,
      incorrectCount: attempt.result.incorrectCount,
      unansweredCount: attempt.result.unansweredCount,
      accuracyPercentage: attempt.result.accuracyPercentage,
    };
  }

  private mapAssessmentAttempt(attempt: AssessmentAttempt): LearningHistoryItem {
    return {
      id: attempt.id,
      type: 'Olympiad',
      title: 'Abacus Olympiad Test',
      startedAt: attempt.startedAt,
      completedAt: attempt.completedAt,
      totalQuestions: attempt.result.totalQuestions,
      correctCount: attempt.result.correctCount,
      incorrectCount: attempt.result.incorrectCount,
      unansweredCount: attempt.result.unansweredCount,
      accuracyPercentage: attempt.result.accuracyPercentage,
    };
  }
}
