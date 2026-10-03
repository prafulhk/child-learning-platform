import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { Router } from '@angular/router';
import { ParentRegistration } from './parent-registration';
import { AuthService } from '../../../core/services/auth.service';

describe('ParentRegistration', () => {
  let component: ParentRegistration;
  let fixture: ComponentFixture<ParentRegistration>;

  const authServiceMock = {
    register: vi.fn(),
    setRegistrationMessage: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [ParentRegistration],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
        {
          provide: Router,
          useValue: routerMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ParentRegistration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid when all fields are empty', () => {
    expect(component.registrationForm.invalid).toBe(true);
  });

  it('should be invalid when name is less than 2 characters', () => {
    component.registrationForm.controls.name.setValue('A');

    expect(component.registrationForm.controls.name.invalid).toBe(true);
  });

  it('should be invalid when email is incorrect', () => {
    component.registrationForm.controls.email.setValue('invalid-email');

    expect(component.registrationForm.controls.email.invalid).toBe(true);
  });

  it('should be invalid when password is less than 8 characters', () => {
    component.registrationForm.controls.password.setValue('1234567');

    expect(component.registrationForm.controls.password.invalid).toBe(true);
  });

  it('should be invalid when confirm password is empty', () => {
    component.registrationForm.controls.confirmPassword.setValue('');

    expect(component.registrationForm.controls.confirmPassword.invalid).toBe(true);
  });

  it('should be invalid when passwords do not match', () => {
    component.registrationForm.setValue({
      name: 'Praful',
      email: 'praful@example.com',
      password: 'Password123',
      confirmPassword: 'Password456',
    });

    expect(component.registrationForm.hasError('passwordMismatch')).toBe(true);
    expect(component.registrationForm.invalid).toBe(true);
  });

  it('should be valid when all fields are correct', () => {
    component.registrationForm.setValue({
      name: 'Praful',
      email: 'praful@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
    });

    expect(component.registrationForm.valid).toBe(true);
  });

  it('should register the parent, show confirmation, and navigate to login', () => {
    authServiceMock.register.mockReturnValue(
      of({
        success: true,
        message: 'Parent account created successfully',
        data: {
          user: {
            id: 'user-1',
            name: 'Praful',
            email: 'praful@example.com',
            role: 'PARENT',
            createdAt: '2026-10-03T00:00:00.000Z',
          },
        },
        user: {
          id: 'user-1',
          name: 'Praful',
          email: 'praful@example.com',
          role: 'PARENT',
          createdAt: '2026-10-03T00:00:00.000Z',
        },
      }),
    );

    component.registrationForm.setValue({
      name: 'Praful',
      email: 'praful@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
    });

    component.onSubmit();

    expect(authServiceMock.register).toHaveBeenCalledWith({
      name: 'Praful',
      email: 'praful@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
    });
    expect(authServiceMock.setRegistrationMessage).toHaveBeenCalledWith(
      'Parent account created successfully',
    );
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
