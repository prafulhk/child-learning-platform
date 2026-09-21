import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardHome } from './dashboard-home';
import { vi } from 'vitest';

describe('DashboardHome', () => {
  let component: DashboardHome;
  let fixture: ComponentFixture<DashboardHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardHome],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit startPractice event', () => {
    const emitSpy = vi.spyOn(component.startPractice, 'emit');

    component.startPractice.emit();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit viewHistory event', () => {
    const emitSpy = vi.spyOn(component.viewHistory, 'emit');

    component.viewHistory.emit();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit openParentTools event', () => {
    const emitSpy = vi.spyOn(component.openParentTools, 'emit');

    component.openParentTools.emit();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit openAssessment event', () => {
    const emitSpy = vi.spyOn(component.openAssessment, 'emit');

    component.openAssessment.emit();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit openRegistration event', () => {
    const emitSpy = vi.spyOn(component.openRegistration, 'emit');

    component.openRegistration.emit();

    expect(emitSpy).toHaveBeenCalled();
  });
});
