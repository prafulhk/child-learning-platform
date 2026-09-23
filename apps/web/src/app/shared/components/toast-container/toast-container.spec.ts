import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';

import { ToastContainerComponent } from './toast-container';
import { ToastService } from '../../../core/services/toast';

describe('ToastContainerComponent', () => {
  let component: ToastContainerComponent;
  let fixture: ComponentFixture<ToastContainerComponent>;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastContainerComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(ToastService);

    toastService.clearAll();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a success toast', () => {
    toastService.success('Child added successfully');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Child added successfully');
  });

  it('should display an error toast', () => {
    toastService.error('Unable to save child');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Unable to save child');
  });

  it('should dismiss a toast when dismissToast is called', () => {
    const toastId = toastService.success('Test notification');

    fixture.detectChanges();
    expect(toastService.toasts()).toHaveLength(1);

    component.dismissToast(toastId);
    fixture.detectChanges();

    expect(toastService.toasts()).toHaveLength(0);
  });

  it('should render the dismiss button', () => {
    toastService.info('Information message');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button[aria-label="Dismiss notification"]');

    expect(button).toBeTruthy();
  });
});
