import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { App } from './app';
import { PracticeSessionComponent } from './features/practice/practice-session.component';

@Component({
  selector: 'app-practice-session',
  standalone: true,
  template: '',
})
class PracticeSessionStubComponent {}

describe('App', () => {
  beforeEach(async () => {
    TestBed.overrideComponent(App, {
      remove: {
        imports: [PracticeSessionComponent],
      },
      add: {
        imports: [PracticeSessionStubComponent],
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
  });

  it('should render the practice session host after Start Practice is clicked', () => {
    const fixture = TestBed.createComponent(App);

    fixture.detectChanges();

    const startButton = fixture.nativeElement.querySelector('button') as HTMLButtonElement | null;

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
});
