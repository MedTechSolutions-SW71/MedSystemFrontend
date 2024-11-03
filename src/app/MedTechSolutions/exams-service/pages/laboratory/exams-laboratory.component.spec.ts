import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamsLaboratoryComponent } from './exams-laboratory.component';

describe('ExamsLaboratoryComponent', () => {
  let component: ExamsLaboratoryComponent;
  let fixture: ComponentFixture<ExamsLaboratoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExamsLaboratoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamsLaboratoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
