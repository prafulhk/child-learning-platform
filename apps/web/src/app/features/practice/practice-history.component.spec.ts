import { TestBed } from '@angular/core/testing';
import { LocalStorageService, PracticeAttempt } from '../../core/services/local-storage.service';
import { PracticeHistoryComponent } from './practice-history.component';

describe('PracticeHistoryComponent', () => {
  const buildAttempt = (overrides: Partial<PracticeAttempt>): PracticeAttempt => ({
    id: 'attempt-1',
    topicId: 'single-digit-addition',
    startedAt: '2026-09-19T10:00:00Z',
    completedAt: '2026-09-19T10:03:42Z',
    presentedQuestions: [],
    selectedAnswers: {},
    result: {
      totalQuestions: 10,
      correctCount: 8,
      incorrectCount: 2,
      unansweredCount: 0,
      accuracyPercentage: 80,
    },
    ...overrides,
  });

  let mockLocalStorageService: { getCompletedAttempts: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockLocalStorageService = {
      getCompletedAttempts: vi.fn().mockReturnValue([]),
    };

    await TestBed.configureTestingModule({
      imports: [PracticeHistoryComponent],
      providers: [{ provide: LocalStorageService, useValue: mockLocalStorageService }],
    }).compileComponents();
  });

  it('renders Practice History', () => {
    const fixture = TestBed.createComponent(PracticeHistoryComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent as string).toContain('Practice History');
  });

  it('renders empty state when there are no attempts', () => {
    mockLocalStorageService.getCompletedAttempts.mockReturnValue([]);

    const fixture = TestBed.createComponent(PracticeHistoryComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent as string).toContain('No practice attempts yet.');
  });

  it('renders stored attempts', () => {
    mockLocalStorageService.getCompletedAttempts.mockReturnValue([
      buildAttempt({ id: 'a1' }),
      buildAttempt({ id: 'a2', completedAt: '2026-09-19T10:05:00Z' }),
    ]);

    const fixture = TestBed.createComponent(PracticeHistoryComponent);
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('[data-testid="history-card"]');

    expect(cards.length).toBe(2);
  });

  it('displays accuracy', () => {
    mockLocalStorageService.getCompletedAttempts.mockReturnValue([
      buildAttempt({
        result: {
          totalQuestions: 10,
          correctCount: 9,
          incorrectCount: 1,
          unansweredCount: 0,
          accuracyPercentage: 90,
        },
      }),
    ]);

    const fixture = TestBed.createComponent(PracticeHistoryComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent as string).toContain('90%');
  });

  it('displays correct / total', () => {
    mockLocalStorageService.getCompletedAttempts.mockReturnValue([
      buildAttempt({
        result: {
          totalQuestions: 12,
          correctCount: 9,
          incorrectCount: 3,
          unansweredCount: 0,
          accuracyPercentage: 75,
        },
      }),
    ]);

    const fixture = TestBed.createComponent(PracticeHistoryComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent as string).toContain('9 / 12');
  });

  it('displays duration', () => {
    mockLocalStorageService.getCompletedAttempts.mockReturnValue([
      buildAttempt({
        startedAt: '2026-09-19T10:00:00Z',
        completedAt: '2026-09-19T10:03:42Z',
      }),
    ]);

    const fixture = TestBed.createComponent(PracticeHistoryComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent as string).toContain('3:42');
  });

  it('sorts newest attempt first', () => {
    mockLocalStorageService.getCompletedAttempts.mockReturnValue([
      buildAttempt({ id: 'oldest', completedAt: '2026-09-19T10:02:00Z' }),
      buildAttempt({ id: 'newest', completedAt: '2026-09-19T10:10:00Z' }),
      buildAttempt({ id: 'middle', completedAt: '2026-09-19T10:05:00Z' }),
    ]);

    const fixture = TestBed.createComponent(PracticeHistoryComponent);
    fixture.detectChanges();

    const cards = Array.from(
      fixture.nativeElement.querySelectorAll('[data-testid="history-card"]'),
    ) as HTMLElement[];

    expect(cards[0].getAttribute('data-attempt-id')).toBe('newest');
    expect(cards[1].getAttribute('data-attempt-id')).toBe('middle');
    expect(cards[2].getAttribute('data-attempt-id')).toBe('oldest');
  });

  it('handles multiple attempts', () => {
    mockLocalStorageService.getCompletedAttempts.mockReturnValue([
      buildAttempt({ id: 'a1' }),
      buildAttempt({ id: 'a2', completedAt: '2026-09-19T10:05:00Z' }),
      buildAttempt({ id: 'a3', completedAt: '2026-09-19T10:06:00Z' }),
      buildAttempt({ id: 'a4', completedAt: '2026-09-19T10:07:00Z' }),
    ]);

    const fixture = TestBed.createComponent(PracticeHistoryComponent);
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('[data-testid="history-card"]');

    expect(cards.length).toBe(4);
    expect(fixture.nativeElement.textContent as string).not.toContain('No practice attempts yet.');
  });

  it('renders Back to Home button', () => {
    const fixture = TestBed.createComponent(PracticeHistoryComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent as string).toContain('Back to Home');
  });

  it('emits backToHome when Back to Home is clicked', () => {
    const fixture = TestBed.createComponent(PracticeHistoryComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.backToHome, 'emit');

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];
    const backButton = buttons.find((button) => button.textContent?.trim() === 'Back to Home');

    if (!backButton) {
      throw new Error('Expected Back to Home button to exist');
    }

    backButton.click();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('emits viewAttempt when a history card is clicked', () => {
    const selectedAttempt = buildAttempt({ id: 'selected-attempt' });
    mockLocalStorageService.getCompletedAttempts.mockReturnValue([selectedAttempt]);

    const fixture = TestBed.createComponent(PracticeHistoryComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.viewAttempt, 'emit');

    const card = fixture.nativeElement.querySelector(
      '[data-testid="history-card"]',
    ) as HTMLButtonElement | null;

    if (!card) {
      throw new Error('Expected history card to exist');
    }

    card.click();

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith(selectedAttempt);
  });
});
