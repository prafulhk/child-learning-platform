import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Output } from '@angular/core';

import { LocalStorageService, PracticeAttempt } from '../../core/services/local-storage.service';

import type { AssessmentAttempt } from '../../core/models/assessment.model';
import { AttemptsApiService, BackendAttempt } from '../../core/services/attempts-api.service.ts';
import { finalize } from 'rxjs';

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
  private readonly attemptsApiService = inject(AttemptsApiService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  @Output() backToHome = new EventEmitter<void>();
  historyItems: LearningHistoryItem[] = [];

  isLoading = false;
  errorMessage = '';

  selectedFilter: 'All' | 'Practice' | 'Olympiad' = 'All';

  constructor() {
    this.loadHistory();
  }

  private loadHistory(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.attemptsApiService
      .getAttempts()
      .pipe(
        finalize(() => {
          this.isLoading = false;

          console.log('Loading completed:', this.isLoading);

          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe({
        next: (response) => {
          console.log('Backend history response:', response);

          this.historyItems = response.attempts
            .map((attempt) => this.mapBackendAttempt(attempt))
            .sort(this.sortByCompletedDate);

          console.log('Mapped history items:', this.historyItems);
        },

        error: (error) => {
          console.error('Unable to load backend history:', error);

          this.loadLocalHistory();

          this.errorMessage = 'Unable to load online history. Showing locally saved attempts.';
        },
      });
  }

  private loadLocalHistory(): void {
    const practiceAttempts = this.localStorageService.getCompletedAttempts();

    const assessmentAttempts = this.localStorageService.getCompletedAssessmentAttempts();

    const practiceHistory = practiceAttempts.map((attempt) => this.mapPracticeAttempt(attempt));

    const assessmentHistory = assessmentAttempts.map((attempt) =>
      this.mapAssessmentAttempt(attempt),
    );

    this.historyItems = [...practiceHistory, ...assessmentHistory].sort(this.sortByCompletedDate);
  }

  private mapBackendAttempt(attempt: BackendAttempt): LearningHistoryItem {
    const isPractice = attempt.attemptType === 'PRACTICE';

    return {
      id: attempt._id,
      type: isPractice ? 'Practice' : 'Olympiad',
      title: isPractice
        ? `Practice - ${attempt.topicId ?? 'General'}`
        : (attempt.title ?? 'Abacus Olympiad Test'),
      startedAt: attempt.startedAt,
      completedAt: attempt.completedAt,
      totalQuestions: attempt.result.totalQuestions,
      correctCount: attempt.result.correctCount,
      incorrectCount: attempt.result.incorrectCount,
      unansweredCount: attempt.result.unansweredCount,
      accuracyPercentage: attempt.result.accuracyPercentage,
    };
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

  private sortByCompletedDate(a: LearningHistoryItem, b: LearningHistoryItem): number {
    return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
  }

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

    const totalQuestions = this.historyItems.reduce((sum, item) => sum + item.totalQuestions, 0);

    const totalCorrectAnswers = this.historyItems.reduce((sum, item) => sum + item.correctCount, 0);

    if (totalQuestions === 0) {
      return 0;
    }

    return Math.round((totalCorrectAnswers / totalQuestions) * 100);
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
