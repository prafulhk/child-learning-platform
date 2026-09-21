import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ParentRegistration } from './parent-registration';
import { AuthService } from '../../../core/services/auth.service';

describe('ParentRegistration', () => {
  let component: ParentRegistration;
  let fixture: ComponentFixture<ParentRegistration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParentRegistration],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: vi.fn(),
          },
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
});
