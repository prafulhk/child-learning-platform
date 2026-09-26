import { Injectable, signal } from '@angular/core';

import type { Child } from './child.service';

@Injectable({
  providedIn: 'root',
})
export class ActiveChildService {
  private readonly selectedChild = signal<Child | null>(null);

  readonly activeChild = this.selectedChild.asReadonly();

  setActiveChild(child: Child): void {
    this.selectedChild.set(child);
  }

  clearActiveChild(): void {
    this.selectedChild.set(null);
  }
}
