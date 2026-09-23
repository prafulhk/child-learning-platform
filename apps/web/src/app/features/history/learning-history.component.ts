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

  selectedFilter: 'All' | 'Practice' | 'Olympiad' = 'All';

  get filteredHistoryItems(): LearningHistoryItem[] {
    if (this.selectedFilter === 'All') {
      return this.historyItems;
    }

    return this.historyItems.filter((item) => item.type === this.selectedFilter);
  }

  get totalAttempts(): number {
    return this.historyItems.length;
  }

  get averageAccuracy(): number {
    if (this.historyItems.length === 0) {
      return 0;
    }

    const totalAccuracy = this.historyItems.reduce((sum, item) => sum + item.accuracyPercentage, 0);

    return Math.round(totalAccuracy / this.historyItems.length);
  }

  get practiceCount(): number {
    return this.historyItems.filter((item) => item.type === 'Practice').length;
  }

  get olympiadCount(): number {
    return this.historyItems.filter((item) => item.type === 'Olympiad').length;
  }

  setFilter(filter: 'All' | 'Practice' | 'Olympiad'): void {
    this.selectedFilter = filter;
  }
}
