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

  // =====================================================
  // BASIC CONTENT
  // =====================================================

  it('renders Daily Practice heading', () => {
    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Daily Practice');
  });

  it('renders practice description', () => {
    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Build your skills with targeted practice sessions.');
  });

  it('renders Select a topic heading', () => {
    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Select a topic');
  });

  // =====================================================
  // TOPICS
  // =====================================================

  it('renders Single-Digit Addition', () => {
    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Single-Digit Addition');
  });

  it('renders Single-Digit Subtraction', () => {
    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Single-Digit Subtraction');
  });

  it('renders Single-Digit Multiplication', () => {
    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Single-Digit Multiplication');
  });

  it('renders the correct number of topic buttons', () => {
    const buttons = fixture.nativeElement.querySelectorAll('div.grid button');

    expect(buttons).toHaveLength(3);
  });

  it('renders question counts for topics', () => {
    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('10');
  });

  it('renders topic durations', () => {
    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('5m');
    expect(text).toContain('7m');
  });

  // =====================================================
  // START PRACTICE
  // =====================================================

  it('emits startPractice with the selected topic id', () => {
    const emitSpy = vi.spyOn(component.startPractice, 'emit');

    const topicButton = fixture.nativeElement.querySelector(
      'div.grid button',
    ) as HTMLButtonElement | null;

    expect(topicButton).toBeTruthy();

    topicButton!.click();

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith('single-digit-addition');
  });

  it('renders the correct aria label for a topic', () => {
    const topicButton = fixture.nativeElement.querySelector(
      'div.grid button',
    ) as HTMLButtonElement | null;

    expect(topicButton).toBeTruthy();

    expect(topicButton!.getAttribute('aria-label')).toBe(
      'Start Single-Digit Addition practice with 10 questions',
    );
  });

  // =====================================================
  // PRACTICE HISTORY
  // =====================================================

  it('renders View Practice History button', () => {
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];

    const button = buttons.find((btn) => btn.textContent?.trim() === 'View Practice History');

    expect(button).toBeTruthy();
  });

  it('emits history event when View Practice History is clicked', () => {
    const emitSpy = vi.spyOn(component.viewHistory, 'emit');

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];

    const button = buttons.find((btn) => btn.textContent?.trim() === 'View Practice History');

    expect(button).toBeTruthy();

    button!.click();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  // =====================================================
  // EVENT HANDLERS
  // =====================================================

  it('calls onStartPractice with the topic id', () => {
    const emitSpy = vi.spyOn(component.startPractice, 'emit');

    component.onStartPractice('single-digit-subtraction');

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith('single-digit-subtraction');
  });

  it('calls onViewHistory', () => {
    const emitSpy = vi.spyOn(component.viewHistory, 'emit');

    component.onViewHistory();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });
});
