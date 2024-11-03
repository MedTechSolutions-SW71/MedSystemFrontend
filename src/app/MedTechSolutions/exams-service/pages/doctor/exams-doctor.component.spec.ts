import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamsDoctorComponent } from './exams-doctor.component';

describe('ExamsDoctorComponent', () => {
  let component: ExamsDoctorComponent;
  let fixture: ComponentFixture<ExamsDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExamsDoctorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamsDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
