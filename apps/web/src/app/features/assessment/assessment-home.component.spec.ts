import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { AssessmentHomeComponent } from './assessment-home.component';

describe('AssessmentHomeComponent', () => {
  let fixture: ComponentFixture<AssessmentHomeComponent>;
  let component: AssessmentHomeComponent;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentHomeComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AssessmentHomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
  });

  it('renders the assessment title', () => {
    expect(fixture.nativeElement.textContent).toContain('Abacus Olympiad Test');
  });

  it('renders 100 questions', () => {
    expect(fixture.nativeElement.textContent).toContain('100');
  });

  it('renders 15 minutes duration', () => {
    const text = fixture.nativeElement.textContent.replace(/\s+/g, ' ').trim();

    expect(text).toMatch(/Duration\s*:?\s*15\s*min/i);
  });

  it('navigates to the assessment session when Start Assessment is clicked', () => {
    component.onStart();

    expect(router.navigate).toHaveBeenCalledWith(['/assessment/session']);
  });

  it('navigates to the dashboard when Back to Home is clicked', () => {
    component.onBack();

    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('navigates to assessment history', () => {
    component.onOpenHistory();

    expect(router.navigate).toHaveBeenCalledWith(['/assessment/history']);
  });
});
