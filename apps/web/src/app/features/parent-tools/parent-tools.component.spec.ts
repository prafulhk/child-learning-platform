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

  const child = {
    _id: 'child-1',
    parentId: 'parent-1',
    name: 'Aarav',
    dateOfBirth: '2020-08-10T00:00:00.000Z',
    grade: 'UKG',
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  };

  const updatedChild = {
    ...child,
    name: 'Aarav Updated',
    dateOfBirth: '2020-08-11T00:00:00.000Z',
    grade: 'Grade 1',
  };

  const mockChildService = {
    getChildren: vi.fn().mockReturnValue(of({ children: [child] })),
    createChild: vi.fn(),
    updateChild: vi.fn().mockReturnValue(of({ child: updatedChild })),
  };

  const mockToastService = {
    success: vi.fn(),
    error: vi.fn(),
  };

  const mockActiveChildService = {
    activeChild: vi.fn().mockReturnValue(null),
    setActiveChild: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

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
      'button[class*="flex min-w-0 flex-1"]',
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

  it('opens the edit form with the current child values', () => {
    const editButton = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    ).find((candidate) => candidate.textContent?.trim() === 'Edit') as HTMLButtonElement | undefined;

    if (!editButton) {
      throw new Error('Expected Edit button to exist');
    }

    editButton.click();
    fixture.detectChanges();

    expect(component.editingChildId()).toBe('child-1');
    expect(component.editChildName()).toBe('Aarav');
    expect(component.editChildDateOfBirth()).toBe('2020-08-10');
    expect(component.editChildGrade()).toBe('UKG');
    expect(fixture.nativeElement.textContent as string).toContain('Save Changes');
  });

  it('updates the child and refreshes the active child when it is selected', () => {
    mockActiveChildService.activeChild.mockReturnValue(child);
    component.onStartEditChild(child);
    component.onEditChildNameChange('Aarav Updated');
    component.onEditChildDateOfBirthChange('2020-08-11');
    component.onEditChildGradeChange('Grade 1');

    component.onUpdateChild(child);

    expect(mockChildService.updateChild).toHaveBeenCalledWith('child-1', {
      name: 'Aarav Updated',
      dateOfBirth: '2020-08-11',
      grade: 'Grade 1',
    });
    expect(component.children()[0]).toEqual(updatedChild);
    expect(mockActiveChildService.setActiveChild).toHaveBeenCalledWith(updatedChild);
    expect(mockToastService.success).toHaveBeenCalledWith('Aarav Updated updated successfully!');
    expect(component.editingChildId()).toBeNull();
  });

  it('rejects an invalid child name before calling the API', () => {
    component.onStartEditChild(child);
    component.onEditChildNameChange('A');

    component.onUpdateChild(child);

    expect(mockChildService.updateChild).not.toHaveBeenCalled();
    expect(mockToastService.error).toHaveBeenCalledWith(
      'Child name must be at least 2 characters.',
    );
  });
});
