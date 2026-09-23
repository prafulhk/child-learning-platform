import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private nextId = 1;

  private readonly toastState = signal<Toast[]>([]);

  readonly toasts = this.toastState.asReadonly();

  show(message: string, type: ToastType = 'info', duration = 4000): number {
    const id = this.nextId++;

    this.toastState.update((toasts) => [...toasts, { id, type, message }]);

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }

    return id;
  }

  success(message: string, duration = 4000): number {
    return this.show(message, 'success', duration);
  }

  error(message: string, duration = 4000): number {
    return this.show(message, 'error', duration);
  }

  warning(message: string, duration = 4000): number {
    return this.show(message, 'warning', duration);
  }

  info(message: string, duration = 4000): number {
    return this.show(message, 'info', duration);
  }

  dismiss(id: number): void {
    this.toastState.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  clearAll(): void {
    this.toastState.set([]);
  }
}
