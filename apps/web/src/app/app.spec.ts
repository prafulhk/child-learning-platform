import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type {
  ActiveAssessmentSession,
  AssessmentQuestionSnapshot,
} from './core/models/assessment.model';

import type { SimpleArithmeticQuestion } from './core/models/question.model';

import { AssessmentService } from './core/services/assessment.service';

import { PracticeAttempt } from './core/services/local-storage.service';

import { QuestionService } from './core/services/question.service';

import { AssessmentHomeComponent } from './features/assessment/assessment-home.component';

import { AssessmentSessionComponent } from './features/assessment/assessment-session.component';

import { PracticeHistoryComponent } from './features/practice/practice-history.component';

import { PracticeAttemptDetailComponent } from './features/practice/practice-attempt-detail.component';

import { ParentToolsComponent } from './features/parent-tools/parent-tools.component';

import { QuestionBankComponent } from './features/question-bank/question-bank.component';

import { App } from './app';

import { PracticeSessionComponent } from './features/practice/practice-session.component';

describe('App', () => {
  it('should create the app', () => {
    // ...
  });
});

@Component({
  selector: 'app-practice-session',
  standalone: true,
  template: '',
})
class PracticeSessionStubComponent {}

@Component({
  selector: 'app-practice-history',
  standalone: true,
  template: '<button type="button" (click)="backToHome.emit()">Back to Home</button>',
})
class PracticeHistoryStubComponent {
  @Output()
  backToHome = new EventEmitter<void>();

  @Output()
  viewAttempt = new EventEmitter<PracticeAttempt>();
}

@Component({
  selector: 'app-practice-attempt-detail',
  standalone: true,
  template: '<button type="button" (click)="backToHistory.emit()">Back to History</button>',
})
class PracticeAttemptDetailStubComponent {
  @Input({ required: true }) attempt!: PracticeAttempt;

  @Output()
  backToHistory = new EventEmitter<void>();
}

@Component({
  selector: 'app-parent-tools',
  standalone: true,
  template:
    '<button type="button" (click)="openQuestionBank.emit()">Question Bank</button><button type="button" (click)="backToHome.emit()">Back to Home</button>',
})
class ParentToolsStubComponent {
  @Output()
  openQuestionBank = new EventEmitter<void>();

  @Output()
  backToHome = new EventEmitter<void>();
}

@Component({
  selector: 'app-question-bank',
  standalone: true,
  template:
    '<button type="button" (click)="backToParentTools.emit()">Back to Parent Tools</button>',
})
class QuestionBankStubComponent {
  @Output()
  backToParentTools = new EventEmitter<void>();
}

@Component({
  selector: 'app-assessment-home',
  standalone: true,
  template: `
    <button type="button" (click)="startAssessment.emit()">Start Test</button>

    <button type="button" (click)="back.emit()">Back</button>
  `,
})
class AssessmentHomeStubComponent {
  @Output()
  startAssessment = new EventEmitter<void>();

  @Output()
  back = new EventEmitter<void>();
}

@Component({
  selector: 'app-assessment-session',
  standalone: true,
  template: '<div>Assessment Session</div>',
})
class AssessmentSessionStubComponent {
  @Input({ required: true })
  question!: AssessmentQuestionSnapshot;

  @Input()
  currentQuestionIndex = 0;

  @Input()
  totalQuestions = 0;

  @Input()
  selectedOptionId: string | null = null;

  @Input()
  flagged = false;

  @Input()
  timeRemainingLabel = '';

  @Output()
  optionSelected = new EventEmitter<string>();

  @Output()
  previous = new EventEmitter<void>();

  @Output()
  flag = new EventEmitter<void>();
}
