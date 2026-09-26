import { TestBed } from '@angular/core/testing';

import type { Child } from './child.service';
import { ActiveChildService } from './active-child.service';

describe('ActiveChildService', () => {
  let service: ActiveChildService;

  const child: Child = {
    _id: 'child-1',
    parentId: 'parent-1',
    name: 'Test Child',
    grade: 'UKG',
    createdAt: '2026-09-26T00:00:00.000Z',
    updatedAt: '2026-09-26T00:00:00.000Z',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});

    service = TestBed.inject(ActiveChildService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should have no active child initially', () => {
    expect(service.activeChild()).toBeNull();
  });

  it('should set the active child', () => {
    service.setActiveChild(child);

    expect(service.activeChild()).toEqual(child);
  });

  it('should clear the active child', () => {
    service.setActiveChild(child);

    service.clearActiveChild();

    expect(service.activeChild()).toBeNull();
  });
});
