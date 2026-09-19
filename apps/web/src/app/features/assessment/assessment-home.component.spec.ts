import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentHomeComponent } from './assessment-home.component';

describe('AssessmentHomeComponent', () => {
  let fixture: ComponentFixture<AssessmentHomeComponent>;
  let component: AssessmentHomeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssessmentHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders the assessment title', () => {
    expect(fixture.nativeElement.textContent).toContain('Abacus Olympiad Test');
  });

  it('renders 100 questions', () => {
    expect(fixture.nativeElement.textContent).toContain('100');
  });

  it('renders 15 minutes', () => {
    expect(fixture.nativeElement.textContent).toContain('15 Minutes');
  });

  it('emits startAssessment when Start Test is clicked', () => {
    const emitSpy = vi.spyOn(component.startAssessment, 'emit');

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    button.click();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('emits back when Back is clicked', () => {
    const emitSpy = vi.spyOn(component.back, 'emit');

    const buttons = fixture.nativeElement.querySelectorAll(
      'button',
    ) as NodeListOf<HTMLButtonElement>;

    const backButton = buttons[1];

    backButton.click();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });
});
