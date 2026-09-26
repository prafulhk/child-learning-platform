import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AnswerOptionComponent } from './answer-option.component';

describe('AnswerOptionComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnswerOptionComponent],
    }).compileComponents();
  });

  // =====================================================
  // BASIC RENDERING
  // =====================================================

  it('creates the component', () => {
    const fixture = TestBed.createComponent(AnswerOptionComponent);

    fixture.componentInstance.option = {
      id: 'opt_a',
      value: 7,
    };

    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders option value', () => {
    const fixture = TestBed.createComponent(AnswerOptionComponent);

    fixture.componentInstance.option = {
      id: 'opt_a',
      value: 7,
    };

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('7');
  });

  // =====================================================
  // OPTION LETTER
  // =====================================================

  it('renders option letter A for option number 0', () => {
    const fixture = TestBed.createComponent(AnswerOptionComponent);

    fixture.componentInstance.option = {
      id: 'opt_a',
      value: 7,
    };

    fixture.componentInstance.optionNumber = 0;

    fixture.detectChanges();

    expect(fixture.componentInstance.optionLetter).toBe('A');
    expect(fixture.nativeElement.textContent).toContain('A.');
  });

  it('renders option letter B for option number 1', () => {
    const fixture = TestBed.createComponent(AnswerOptionComponent);

    fixture.componentInstance.option = {
      id: 'opt_b',
      value: 8,
    };

    fixture.componentInstance.optionNumber = 1;

    fixture.detectChanges();

    expect(fixture.componentInstance.optionLetter).toBe('B');
    expect(fixture.nativeElement.textContent).toContain('B.');
  });

  it('renders option letter C for option number 2', () => {
    const fixture = TestBed.createComponent(AnswerOptionComponent);

    fixture.componentInstance.option = {
      id: 'opt_c',
      value: 9,
    };

    fixture.componentInstance.optionNumber = 2;

    fixture.detectChanges();

    expect(fixture.componentInstance.optionLetter).toBe('C');
    expect(fixture.nativeElement.textContent).toContain('C.');
  });

  it('renders option letter D for option number 3', () => {
    const fixture = TestBed.createComponent(AnswerOptionComponent);

    fixture.componentInstance.option = {
      id: 'opt_d',
      value: 10,
    };

    fixture.componentInstance.optionNumber = 3;

    fixture.detectChanges();

    expect(fixture.componentInstance.optionLetter).toBe('D');
    expect(fixture.nativeElement.textContent).toContain('D.');
  });

  // =====================================================
  // UNSELECTED STATE
  // =====================================================

  it('keeps the neutral radio style when the option is not selected', () => {
    const fixture = TestBed.createComponent(AnswerOptionComponent);

    fixture.componentInstance.option = {
      id: 'opt_c',
      value: 9,
    };

    fixture.componentInstance.selected = false;

    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    const radio = button.querySelector('[aria-hidden="true"]') as HTMLSpanElement;

    expect(radio).toBeTruthy();

    expect(radio.classList.contains('border-slate-400')).toBe(true);
    expect(radio.classList.contains('bg-white')).toBe(true);

    expect(radio.classList.contains('border-[#0789bd]')).toBe(false);
    expect(radio.classList.contains('bg-[#0789bd]')).toBe(false);

    expect(button.getAttribute('aria-checked')).toBe('false');
  });

  // =====================================================
  // SELECTED STATE
  // =====================================================

  it('applies selected radio styles and aria attribute', () => {
    const fixture = TestBed.createComponent(AnswerOptionComponent);

    fixture.componentInstance.option = {
      id: 'opt_c',
      value: 9,
    };

    fixture.componentInstance.selected = true;

    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    const radio = button.querySelector('[aria-hidden="true"]') as HTMLSpanElement;

    expect(radio).toBeTruthy();

    expect(radio.classList.contains('border-[#0789bd]')).toBe(true);
    expect(radio.classList.contains('bg-[#0789bd]')).toBe(true);

    expect(button.getAttribute('aria-checked')).toBe('true');
  });

  it('renders the white selected radio dot', () => {
    const fixture = TestBed.createComponent(AnswerOptionComponent);

    fixture.componentInstance.option = {
      id: 'opt_c',
      value: 9,
    };

    fixture.componentInstance.selected = true;

    fixture.detectChanges();

    const radio = fixture.nativeElement.querySelector('[aria-hidden="true"]') as HTMLSpanElement;

    const dot = radio.querySelector('span');

    expect(dot).toBeTruthy();
    expect(dot?.classList.contains('bg-white')).toBe(true);
  });

  // =====================================================
  // CLICK / OUTPUT
  // =====================================================

  it('emits selected option id on click', () => {
    const fixture = TestBed.createComponent(AnswerOptionComponent);

    fixture.componentInstance.option = {
      id: 'opt_b',
      value: 8,
    };

    fixture.detectChanges();

    const emitSpy = vi.spyOn(fixture.componentInstance.optionSelected, 'emit');

    const button = fixture.debugElement.query(By.css('button'));

    button.triggerEventHandler('click');

    expect(emitSpy).toHaveBeenCalledWith('opt_b');
  });

  it('emits the correct option id when another option is clicked', () => {
    const fixture = TestBed.createComponent(AnswerOptionComponent);

    fixture.componentInstance.option = {
      id: 'opt_d',
      value: 12,
    };

    fixture.detectChanges();

    const emitSpy = vi.spyOn(fixture.componentInstance.optionSelected, 'emit');

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    button.click();

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith('opt_d');
  });

  // =====================================================
  // ACCESSIBILITY
  // =====================================================

  it('renders the radio role', () => {
    const fixture = TestBed.createComponent(AnswerOptionComponent);

    fixture.componentInstance.option = {
      id: 'opt_a',
      value: 7,
    };

    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.getAttribute('role')).toBe('radio');
  });

  it('renders the correct aria label', () => {
    const fixture = TestBed.createComponent(AnswerOptionComponent);

    fixture.componentInstance.option = {
      id: 'opt_a',
      value: 7,
    };

    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.getAttribute('aria-label')).toBe('Option 7');
  });

  it('sets aria-checked to false when not selected', () => {
    const fixture = TestBed.createComponent(AnswerOptionComponent);

    fixture.componentInstance.option = {
      id: 'opt_a',
      value: 7,
    };

    fixture.componentInstance.selected = false;

    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.getAttribute('aria-checked')).toBe('false');
  });

  it('sets aria-checked to true when selected', () => {
    const fixture = TestBed.createComponent(AnswerOptionComponent);

    fixture.componentInstance.option = {
      id: 'opt_a',
      value: 7,
    };

    fixture.componentInstance.selected = true;

    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.getAttribute('aria-checked')).toBe('true');
  });
});
