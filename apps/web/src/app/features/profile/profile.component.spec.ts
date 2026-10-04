import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { AuthService, type AuthUser } from '../../core/services/auth.service';
import { ProfileComponent } from './profile.component';

const user: AuthUser = {
  id: 'parent-1',
  name: 'Praful Parent',
  email: 'praful@example.com',
  role: 'PARENT',
  createdAt: '2026-10-04T00:00:00.000Z',
};

describe('ProfileComponent', () => {
  let fixture: ComponentFixture<ProfileComponent>;
  let component: ProfileComponent;
  let currentUser = signal<AuthUser | null>(user);
  let updateProfile: ReturnType<typeof vi.fn>;
  let navigate: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    currentUser = signal<AuthUser | null>(user);
    updateProfile = vi.fn(() => of({
      success: true,
      data: { user: { ...user, name: 'Updated Parent' } },
      user: { ...user, name: 'Updated Parent' },
    }));
    navigate = vi.fn();

    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        {
          provide: AuthService,
          useValue: {
            currentUser,
            updateProfile,
          },
        },
        {
          provide: Router,
          useValue: { navigate },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shows the authenticated parent profile', () => {
    expect(fixture.nativeElement.textContent).toContain('Praful Parent');
    expect(fixture.nativeElement.textContent).toContain('praful@example.com');
    expect(fixture.nativeElement.textContent).toContain('PARENT');
  });

  it('updates the permitted profile field', () => {
    component.name = 'Updated Parent';

    component.onSave();

    expect(updateProfile).toHaveBeenCalledWith({ name: 'Updated Parent' });
    expect(component.successMessage).toBe('Profile updated successfully.');
  });
});
