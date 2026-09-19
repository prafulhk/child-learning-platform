import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PracticeAttempt } from './core/services/local-storage.service';
import { PracticeHistoryComponent } from './features/practice/practice-history.component';
import { PracticeAttemptDetailComponent } from './features/practice/practice-attempt-detail.component';

import { App } from './app';
import { PracticeSessionComponent } from './features/practice/practice-session.component';

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

describe('App', () => {
  beforeEach(async () => {
    TestBed.overrideComponent(App, {
      remove: {
        imports: [
          PracticeSessionComponent,
          PracticeHistoryComponent,
          PracticeAttemptDetailComponent,
        ],
      },
      add: {
        imports: [
          PracticeSessionStubComponent,
          PracticeHistoryStubComponent,
          PracticeAttemptDetailStubComponent,
        ],
      },
    });

    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should start on the practice home screen', () => {
    const fixture = TestBed.createComponent(App);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent ?? '').toContain('Abacus Learning');
    expect(compiled.querySelector('app-practice-home')).toBeTruthy();
  });

  it('should render the practice session host after Start Practice is clicked', () => {
    const fixture = TestBed.createComponent(App);

    fixture.detectChanges();

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];
    const startButton =
      buttons.find((button) => button.textContent?.trim() === 'Start Practice') ?? null;

    expect(startButton).toBeDefined();

    if (!startButton) {
      throw new Error('Expected Start Practice button to be rendered');
    }

    expect(startButton.textContent?.trim()).toBe('Start Practice');

    startButton.click();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-practice-session')).toBeTruthy();
  });

  it('should render the practice history host after Practice History is clicked', () => {
    const fixture = TestBed.createComponent(App);

    fixture.detectChanges();

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];
    const historyButton =
      buttons.find((button) => button.textContent?.trim() === 'Practice History') ?? null;

    expect(historyButton).toBeDefined();

    if (!historyButton) {
      throw new Error('Expected Practice History button to be rendered');
    }

    historyButton.click();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-practice-history')).toBeTruthy();
  });

  it('should render the practice attempt detail host after a history item is clicked', () => {
    const fixture = TestBed.createComponent(App);

    fixture.detectChanges();

    const homeButtons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];
    const historyButton =
      homeButtons.find((button) => button.textContent?.trim() === 'Practice History') ?? null;

    if (!historyButton) {
      throw new Error('Expected Practice History button to be rendered');
    }

    historyButton.click();
    fixture.detectChanges();

    const historyComponent = fixture.debugElement.children[0]
      .componentInstance as PracticeHistoryStubComponent;
    historyComponent.viewAttempt.emit({
      id: 'attempt-1',
      topicId: 'single-digit-addition',
      startedAt: '2026-09-19T10:00:00Z',
      completedAt: '2026-09-19T10:01:00Z',
      presentedQuestions: [],
      selectedAnswers: {},
      result: {
        totalQuestions: 1,
        correctCount: 1,
        incorrectCount: 0,
        unansweredCount: 0,
        accuracyPercentage: 100,
      },
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-practice-attempt-detail')).toBeTruthy();
  });

  it('should return to history after Back to History is clicked from details', () => {
    const fixture = TestBed.createComponent(App);

    fixture.detectChanges();

    const homeButtons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];
    const historyButton =
      homeButtons.find((button) => button.textContent?.trim() === 'Practice History') ?? null;

    if (!historyButton) {
      throw new Error('Expected Practice History button to be rendered');
    }

    historyButton.click();
    fixture.detectChanges();

    const historyComponent = fixture.debugElement.children[0]
      .componentInstance as PracticeHistoryStubComponent;
    historyComponent.viewAttempt.emit({
      id: 'attempt-1',
      topicId: 'single-digit-addition',
      startedAt: '2026-09-19T10:00:00Z',
      completedAt: '2026-09-19T10:01:00Z',
      presentedQuestions: [],
      selectedAnswers: {},
      result: {
        totalQuestions: 1,
        correctCount: 1,
        incorrectCount: 0,
        unansweredCount: 0,
        accuracyPercentage: 100,
      },
    });
    fixture.detectChanges();

    const detailComponent = fixture.debugElement.children[0]
      .componentInstance as PracticeAttemptDetailStubComponent;
    detailComponent.backToHistory.emit();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-practice-history')).toBeTruthy();
    expect(compiled.querySelector('app-practice-attempt-detail')).toBeFalsy();
  });

  it('should return to home after Back to Home is clicked from history', () => {
    const fixture = TestBed.createComponent(App);

    fixture.detectChanges();

    const homeButtons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];
    const historyButton =
      homeButtons.find((button) => button.textContent?.trim() === 'Practice History') ?? null;

    if (!historyButton) {
      throw new Error('Expected Practice History button to be rendered');
    }

    historyButton.click();
    fixture.detectChanges();

    const historyHost = fixture.nativeElement as HTMLElement;

    expect(historyHost.querySelector('app-practice-history')).toBeTruthy();

    const backButtons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];
    const backButton =
      backButtons.find((button) => button.textContent?.trim() === 'Back to Home') ?? null;

    if (!backButton) {
      throw new Error('Expected Back to Home button to be rendered in history');
    }

    backButton.click();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent ?? '').toContain('Abacus Learning');
    expect(compiled.querySelector('app-practice-history')).toBeFalsy();
  });
});
