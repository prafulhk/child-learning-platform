import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AnswerOptionComponent } from './answer-option.component';

describe('AnswerOptionComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnswerOptionComponent],
    }).compileComponents();
  });

  it('renders option value', () => {
    const fixture = TestBed.createComponent(AnswerOptionComponent);
    fixture.componentInstance.option = { id: 'opt_a', value: 7 };
    fixture.detectChanges();

    const valueEl = fixture.nativeElement.querySelector('.value');
    expect(valueEl.textContent?.trim()).toBe('7');
  });

  it('keeps the neutral border when the option is not selected', () => {
    const fixture = TestBed.createComponent(AnswerOptionComponent);
    fixture.componentInstance.option = { id: 'opt_c', value: 9 };
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.classList.contains('border-slate-300')).toBe(true);
    expect(button.classList.contains('border-blue-600')).toBe(false);
    expect(button.getAttribute('aria-checked')).toBe('false');
  });

  it('emits selected option id on click', () => {
    const fixture = TestBed.createComponent(AnswerOptionComponent);
    fixture.componentInstance.option = { id: 'opt_b', value: 8 };
    fixture.detectChanges();

    const emitSpy = vi.spyOn(fixture.componentInstance.optionSelected, 'emit');

    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click');

    expect(emitSpy).toHaveBeenCalledWith('opt_b');
  });

  it('applies selected state styles and aria attribute', () => {
    const fixture = TestBed.createComponent(AnswerOptionComponent);
    fixture.componentInstance.option = { id: 'opt_c', value: 9 };
    fixture.componentInstance.selected = true;
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.classList.contains('border-blue-600')).toBe(true);
    expect(button.classList.contains('bg-blue-50')).toBe(true);
    expect(button.getAttribute('aria-checked')).toBe('true');
  });
});
