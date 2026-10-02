import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { ActiveChildService } from '../../core/services/active-child.service';
import { ChildService } from '../../core/services/child.service';
import { ToastService } from '../../core/services/toast';
import { ParentToolsComponent } from './parent-tools.component';

describe('ParentToolsComponent', () => {
  let fixture: ComponentFixture<ParentToolsComponent>;
  let component: ParentToolsComponent;
  let router: Router;

  const mockChildService = {
    getChildren: vi.fn().mockReturnValue(
      of({
        children: [
          {
            _id: 'child-1',
            parentId: 'parent-1',
            name: 'Aarav',
            grade: 'UKG',
            createdAt: '2026-09-01T00:00:00.000Z',
            updatedAt: '2026-09-01T00:00:00.000Z',
          },
        ],
      }),
    ),
    createChild: vi.fn(),
  };

  const mockToastService = {
    success: vi.fn(),
    error: vi.fn(),
  };

  const mockActiveChildService = {
    setActiveChild: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParentToolsComponent],
      providers: [
        provideRouter([]),
        { provide: ChildService, useValue: mockChildService },
        { provide: ToastService, useValue: mockToastService },
        { provide: ActiveChildService, useValue: mockActiveChildService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ParentToolsComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('renders Parent Tools', () => {
    expect(fixture.nativeElement.textContent as string).toContain('Parent Tools');
  });

  it('renders Question Bank button', () => {
    expect(fixture.nativeElement.textContent as string).toContain('Question Bank');
  });

  it('navigates to question bank', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];
    const button = buttons.find((candidate) => candidate.textContent?.trim() === 'Question Bank');

    if (!button) {
      throw new Error('Expected Question Bank button to exist');
    }

    button.click();

    expect(navigateSpy).toHaveBeenCalledWith(['/parent-tools/question-bank']);
  });

  it('navigates back to home dashboard', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];
    const button = buttons.find((candidate) => candidate.textContent?.trim() === 'Back to Home');

    if (!button) {
      throw new Error('Expected Back to Home button to exist');
    }

    button.click();

    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
  });

  it('sets active child when selecting a child', () => {
    const childButton = fixture.nativeElement.querySelector(
      'button[class*="rounded-xl border border-slate-200"]',
    ) as HTMLButtonElement | null;

    if (!childButton) {
      throw new Error('Expected a child selection button to exist');
    }

    childButton.click();

    expect(mockActiveChildService.setActiveChild).toHaveBeenCalledWith(
      expect.objectContaining({ _id: 'child-1', name: 'Aarav' }),
    );
    expect(mockToastService.success).toHaveBeenCalledWith('Aarav selected.');
  });
});
