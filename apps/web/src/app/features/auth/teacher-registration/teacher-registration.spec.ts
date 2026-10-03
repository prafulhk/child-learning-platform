import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { AuthService } from '../../../core/services/auth.service';
import { TeacherRegistration } from './teacher-registration';

describe('TeacherRegistration', () => {
  let component: TeacherRegistration;
  let fixture: ComponentFixture<TeacherRegistration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherRegistration],
      providers: [
        {
          provide: AuthService,
          useValue: {
            registerTeacher: vi.fn(),
            setRegistrationMessage: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TeacherRegistration);
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

  it('should reject mismatched passwords', () => {
    component.registrationForm.setValue({
      name: 'Teacher',
      email: 'teacher@example.com',
      password: 'Password123',
      confirmPassword: 'Password456',
    });

    expect(component.registrationForm.hasError('passwordMismatch')).toBe(true);
    expect(component.registrationForm.invalid).toBe(true);
  });

  it('should accept valid registration details', () => {
    component.registrationForm.setValue({
      name: 'Teacher',
      email: 'teacher@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
    });

    expect(component.registrationForm.valid).toBe(true);
  });
});
