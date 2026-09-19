import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { LocalStorageService, PracticeAttempt } from '../../core/services/local-storage.service';

@Component({
  selector: 'app-practice-history',
  standalone: true,
  templateUrl: './practice-history.component.html',
})
export class PracticeHistoryComponent implements OnInit {
  private readonly localStorageService = inject(LocalStorageService);

  @Output() viewAttempt = new EventEmitter<PracticeAttempt>();
  @Output() backToHome = new EventEmitter<void>();

  readonly attempts = signal<PracticeAttempt[]>([]);

  ngOnInit(): void {
    const sortedAttempts = [...this.localStorageService.getCompletedAttempts()].sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    );

    this.attempts.set(sortedAttempts);
  }

  formatCompletedDateTime(completedAtIso: string): string {
    const completedDate = new Date(completedAtIso);

    if (Number.isNaN(completedDate.getTime())) {
      return completedAtIso;
    }

    return completedDate.toLocaleString();
  }

  formatDuration(startedAtIso: string, completedAtIso: string): string {
    const startedAt = new Date(startedAtIso).getTime();
    const completedAt = new Date(completedAtIso).getTime();

    if (Number.isNaN(startedAt) || Number.isNaN(completedAt)) {
      return '0:00';
    }

    const totalSeconds = Math.max(0, Math.floor((completedAt - startedAt) / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }

  onBackToHome(): void {
    this.backToHome.emit();
  }

  onViewAttempt(attempt: PracticeAttempt): void {
    this.viewAttempt.emit(attempt);
  }
}
