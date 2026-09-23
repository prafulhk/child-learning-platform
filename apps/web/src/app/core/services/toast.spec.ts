import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ToastService } from './toast';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    vi.useFakeTimers();

    TestBed.configureTestingModule({
      providers: [ToastService],
    });

    service = TestBed.inject(ToastService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a success toast', () => {
    service.success('Child added successfully!');

    expect(service.toasts()).toHaveLength(1);
    expect(service.toasts()[0]).toMatchObject({
      type: 'success',
      message: 'Child added successfully!',
    });
  });

  it('should add an error toast', () => {
    service.error('Unable to save child.');

    expect(service.toasts()[0]).toMatchObject({
      type: 'error',
      message: 'Unable to save child.',
    });
  });

  it('should dismiss a toast manually', () => {
    const id = service.info('Information message');

    service.dismiss(id);

    expect(service.toasts()).toHaveLength(0);
  });

  it('should automatically dismiss a toast after its duration', () => {
    service.success('Temporary message', 4000);

    expect(service.toasts()).toHaveLength(1);

    vi.advanceTimersByTime(4000);

    expect(service.toasts()).toHaveLength(0);
  });

  it('should not automatically dismiss a toast when duration is zero', () => {
    service.info('Persistent message', 0);

    vi.advanceTimersByTime(10000);

    expect(service.toasts()).toHaveLength(1);
  });

  it('should clear all toasts', () => {
    service.success('Success');
    service.error('Error');
    service.warning('Warning');

    service.clearAll();

    expect(service.toasts()).toHaveLength(0);
  });
});
