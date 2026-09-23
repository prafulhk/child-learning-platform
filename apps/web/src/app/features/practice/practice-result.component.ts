import { Component, Input, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { PracticeAttempt } from '../../core/services/local-storage.service';
import { AssessmentAttempt } from '../../core/models/assessment.model';

type AchievementLevel = 0 | 60 | 70 | 80 | 90 | 100;

@Component({
  selector: 'app-practice-result',
  standalone: true,
  templateUrl: './practice-result.component.html',
})
export class PracticeResultComponent implements OnChanges {
  @Input({ required: true })
  attempt!: PracticeAttempt | AssessmentAttempt;

  @Input()
  title = 'Practice Completed';

  @Input()
  actionLabel = 'Practice Again';

  @Input()
  actionType: 'restart' | 'backToHome' = 'restart';

  @Output()
  restart = new EventEmitter<void>();

  @Output()
  backToHome = new EventEmitter<void>();

  achievementLevel: AchievementLevel = 0;

  achievementTitle = '';

  achievementMessage = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['attempt'] && this.attempt) {
      const accuracy = this.attempt.result?.accuracyPercentage ?? 0;

      this.calculateAchievement(accuracy);
    }
  }

  private calculateAchievement(accuracy: number): void {
    if (accuracy >= 100) {
      this.achievementLevel = 100;
      this.achievementTitle = 'Ultimate Math Champion! 👑';
      this.achievementMessage = 'Perfect score! You answered every question correctly.';
    } else if (accuracy >= 91) {
      this.achievementLevel = 90;
      this.achievementTitle = 'Galaxy of Genius! 🌌';
      this.achievementMessage = 'Your math skills are shining across the galaxy!';
    } else if (accuracy >= 81) {
      this.achievementLevel = 80;
      this.achievementTitle = 'Math Magic Unlocked! 🏆';
      this.achievementMessage = 'You unlocked a new level of math magic!';
    } else if (accuracy >= 71) {
      this.achievementLevel = 70;
      this.achievementTitle = 'Number Rocket Launched! 🚀';
      this.achievementMessage = 'Your math skills are taking off!';
    } else if (accuracy >= 60) {
      this.achievementLevel = 60;
      this.achievementTitle = 'Your Learning Is Growing! 🌱';
      this.achievementMessage = 'Every practice session helps your learning grow!';
    } else {
      this.achievementLevel = 0;
      this.achievementTitle = 'Keep Learning! 💪';
      this.achievementMessage = 'Every question is a chance to learn something new.';
    }
  }

  onRestart(): void {
    this.restart.emit();
  }

  onBackToHome(): void {
    this.backToHome.emit();
  }

  onAction(): void {
    if (this.actionType === 'backToHome') {
      this.onBackToHome();
    } else {
      this.onRestart();
    }
  }
}
