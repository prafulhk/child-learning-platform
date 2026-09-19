import { Component, EventEmitter, Output } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PracticeHistoryComponent } from './features/practice/practice-history.component';

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
}

describe('App', () => {
  beforeEach(async () => {
    TestBed.overrideComponent(App, {
      remove: {
        imports: [PracticeSessionComponent, PracticeHistoryComponent],
      },
      add: {
        imports: [PracticeSessionStubComponent, PracticeHistoryStubComponent],
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
