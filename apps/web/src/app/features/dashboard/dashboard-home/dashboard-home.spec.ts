import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { DashboardHome } from './dashboard-home';

describe('DashboardHome', () => {
  let component: DashboardHome;
  let fixture: ComponentFixture<DashboardHome>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardHome],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardHome);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to learning practice', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.onStartPractice();

    expect(navigateSpy).toHaveBeenCalledWith(['/learning/practice']);
  });

  it('should navigate to learning history', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.onViewHistory();

    expect(navigateSpy).toHaveBeenCalledWith(['/learning/history']);
  });

  it('should navigate to parent tools', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.onOpenParentTools();

    expect(navigateSpy).toHaveBeenCalledWith(['/parent-tools']);
  });

  it('should navigate to assessment', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.onOpenAssessment();

    expect(navigateSpy).toHaveBeenCalledWith(['/assessment']);
  });

  it('should navigate to registration', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.onOpenRegistration();

    expect(navigateSpy).toHaveBeenCalledWith(['/register']);
  });

  it('should navigate to login', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.onOpenLogin();

    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should logout and navigate to login', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.onLogout();

    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
