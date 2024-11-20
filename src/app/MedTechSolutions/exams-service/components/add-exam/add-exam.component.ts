import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Patient } from '../../../profiles-service/model/patient';
import { PatientService } from '../../../profiles-service/services/patient.service';
import { AuthenticationService } from '../../../security-service/service/authentication.service';
import { ExamsService } from '../../service/exams.service';

@Component({
  selector: 'app-add-exam',
  templateUrl: './add-exam.component.html',
  styleUrl: './add-exam.component.css'
})
export class AddExamComponent implements OnInit {
  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  examTypes: string[] = [
    'Blood Test', 'Urinalysis', 'X-ray', 'MRI', 'CT Scan', 'Ultrasound', 'ECG', 'Stress Test',
    'Bone Density Test', 'Mammogram', 'Colonoscopy', 'Endoscopy', 'Biopsy', 'Pap Smear',
    'Liver Function Test', 'Kidney Function Test', 'Pulmonary Function Test', 'Thyroid Function Test',
    'Allergy Test', 'Eye Exam', 'Hearing Test', 'Cardiac Catheterization', 'Angiography',
    'Skin Test', 'Glucose Tolerance Test', 'Stool Test', 'HIV Test', 'Pregnancy Test',
    'PSA Test', 'Cholesterol Test'
  ];
  patients: Patient[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private location: Location,
    private patientService: PatientService,
    private examsService: ExamsService,
    private authenticationService: AuthenticationService
  ) {
    this.firstFormGroup = this._formBuilder.group({
      patientId: ['', Validators.required],
      examType: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      examDate: ['', Validators.required]
    });
  }

  onDateSelected(event: Date): void {
    // Formatear la fecha seleccionada para que sea legible y utilizable
    const formattedDate = new Date(event).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
    this.secondFormGroup.controls['examDate'].setValue(formattedDate); // Muestra legible en el frontend
  }

  ngOnInit(): void {
    this.loadPatients();
  }

  private loadPatients(): void {
    this.patientService.getProfiles().subscribe((patients: any[]) => {
      this.patients = patients;
    });
  }

  createExam(): void {
    if (this.firstFormGroup.valid && this.secondFormGroup.valid) {
      const examDateValue = this.secondFormGroup.get('examDate')?.value;
  
      // Convertir la fecha al formato ISO compatible con el backend
      const formattedExamDate = new Date(examDateValue).toISOString().split('T')[0];
  
      const examData = {
        doctorId: this.authenticationService.getId(),
        patientId: this.firstFormGroup.get('patientId')?.value,
        examType: this.firstFormGroup.get('examType')?.value,
        examDate: formattedExamDate, // Fecha formateada para el backend
        examResultDate: formattedExamDate,
        examResult: false,
      };
  
      this.examsService.createExam(examData).subscribe(
        (response) => {
          console.log('Examen creado con éxito:', response);
          alert('Exam created successfully!');
          this.location.back();
        },
        (error) => {
          console.log(examData);
          console.error('Error al crear el examen:', error);
          alert('Failed to create the exam. Please try again.');
        }
      );
    } else {
      alert('Please fill in all the required fields.');
    }
  }


  goBack(): void {
    this.location.back();
  }
}
