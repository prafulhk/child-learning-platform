import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateLessonPlan } from './create-lesson-plan';

describe('CreateLessonPlan', () => {
  let component: CreateLessonPlan;
  let fixture: ComponentFixture<CreateLessonPlan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateLessonPlan],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateLessonPlan);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
