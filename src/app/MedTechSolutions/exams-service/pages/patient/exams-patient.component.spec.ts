import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamsPatientComponent } from './exams-patient.component';

describe('ExamsPatientComponent', () => {
  let component: ExamsPatientComponent;
  let fixture: ComponentFixture<ExamsPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExamsPatientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamsPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
