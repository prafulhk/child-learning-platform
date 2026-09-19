import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PracticeHomeComponent } from './practice-home.component';

describe('PracticeHomeComponent', () => {
  let fixture: ComponentFixture<PracticeHomeComponent>;
  let component: PracticeHomeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticeHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PracticeHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders Abacus Learning', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Abacus Learning');
  });

  it('renders Single-Digit Addition', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Single-Digit Addition');
  });

  it('renders 10 Questions', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('10 Questions');
  });

  it('renders 5 Minutes', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('5 Minutes');
  });

  it('renders Start Practice button', () => {
    const host = fixture.nativeElement as HTMLElement;
    const buttons = Array.from(host.querySelectorAll('button')) as HTMLButtonElement[];

    const button = buttons.find((btn) => btn.textContent?.trim() === 'Start Practice');

    expect(button).toBeTruthy();
  });

  it('renders Practice History button', () => {
    const host = fixture.nativeElement as HTMLElement;
    const buttons = Array.from(host.querySelectorAll('button')) as HTMLButtonElement[];

    const button = buttons.find((btn) => btn.textContent?.trim() === 'Practice History');

    expect(button).toBeTruthy();
  });

  it('emits start event when Start Practice is clicked', () => {
    const emitSpy = vi.spyOn(component.startPractice, 'emit');

    const host = fixture.nativeElement as HTMLElement;
    const buttons = Array.from(host.querySelectorAll('button')) as HTMLButtonElement[];

    const button = buttons.find((btn) => btn.textContent?.trim() === 'Start Practice') as
      HTMLButtonElement | undefined;

    if (!button) {
      throw new Error('Expected Start Practice button to exist');
    }

    button.click();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('emits history event when Practice History is clicked', () => {
    const emitSpy = vi.spyOn(component.viewHistory, 'emit');

    const host = fixture.nativeElement as HTMLElement;
    const buttons = Array.from(host.querySelectorAll('button')) as HTMLButtonElement[];

    const button = buttons.find((btn) => btn.textContent?.trim() === 'Practice History') as
      HTMLButtonElement | undefined;

    if (!button) {
      throw new Error('Expected Practice History button to exist');
    }

    button.click();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });
});
