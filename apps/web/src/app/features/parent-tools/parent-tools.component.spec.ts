import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParentToolsComponent } from './parent-tools.component';

describe('ParentToolsComponent', () => {
  let fixture: ComponentFixture<ParentToolsComponent>;
  let component: ParentToolsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParentToolsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ParentToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders Parent Tools', () => {
    expect(fixture.nativeElement.textContent as string).toContain('Parent Tools');
  });

  it('renders Question Bank button', () => {
    expect(fixture.nativeElement.textContent as string).toContain('Question Bank');
  });

  it('emits openQuestionBank', () => {
    const emitSpy = vi.spyOn(component.openQuestionBank, 'emit');

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];
    const button = buttons.find((candidate) => candidate.textContent?.trim() === 'Question Bank');

    if (!button) {
      throw new Error('Expected Question Bank button to exist');
    }

    button.click();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('emits backToHome', () => {
    const emitSpy = vi.spyOn(component.backToHome, 'emit');

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];
    const button = buttons.find((candidate) => candidate.textContent?.trim() === 'Back to Home');

    if (!button) {
      throw new Error('Expected Back to Home button to exist');
    }

    button.click();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });
});
