import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogLearningComponent } from './log-learning';

describe('LogLearningComponent', () => {
  let component: LogLearningComponent;
  let fixture: ComponentFixture<LogLearningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogLearningComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LogLearningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit backToHome when back is clicked', () => {
    const emitSpy = vi.spyOn(component.backToHome, 'emit');

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    button.click();

    expect(emitSpy).toHaveBeenCalled();
  });
});
