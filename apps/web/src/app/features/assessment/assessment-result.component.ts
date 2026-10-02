import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import type { AssessmentAttempt } from '../../core/models/assessment.model';
import { LocalStorageService } from '../../core/services/local-storage.service';

@Component({
  selector: 'app-assessment-result',
  standalone: true,
  templateUrl: './assessment-result.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssessmentResultComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly localStorageService = inject(LocalStorageService);

  attempt: AssessmentAttempt | null = null;

  ngOnInit(): void {
    const attemptId = this.activatedRoute.snapshot.paramMap.get('attemptId');

    if (!attemptId) {
      void this.router.navigate(['/assessment/history']);
      return;
    }

    this.attempt = this.localStorageService.getCompletedAssessmentAttemptById(attemptId);

    if (!this.attempt) {
      void this.router.navigate(['/assessment/history']);
    }
  }

  onBackToAssessment(): void {
    void this.router.navigate(['/assessment']);
  }

  onViewHistory(): void {
    void this.router.navigate(['/assessment/history']);
  }
}
