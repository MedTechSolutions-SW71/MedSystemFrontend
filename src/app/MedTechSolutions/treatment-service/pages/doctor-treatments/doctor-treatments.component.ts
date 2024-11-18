import {Component, OnInit} from '@angular/core';
import {Treatment} from '../../models/treatment';
import {TreatmentsService} from '../../services/treatments.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Appointment} from "../../../appointments-service/model/appointment";
import {AuthenticationService} from '../../../security-service/service/authentication.service';
import {PatientService} from '../../../profiles-service/services/patient.service';

@Component({
  selector: 'app-doctor-treatments',
  templateUrl: './doctor-treatments.component.html',
  styleUrl: './doctor-treatments.component.css'
})

export class DoctorTreatmentsComponent implements OnInit {
  doctorId: string | null = "";
  currentTreatments: Treatment[] = [];
  treatmentForm: FormGroup;
  showAddForm = false;
  errorMessage: string = '';
  successMessage: string = '';
  patients: any[] = [];

  constructor(
    private treatmentsService: TreatmentsService,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private patientService: PatientService
  ) {
    this.treatmentForm = this.fb.group({
      treatmentName: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      patientId: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.loadTreatments();
    this.loadPatients();
  }

  loadTreatments() {
    this.doctorId = this.authenticationService.getId() ? this.authenticationService.getId() : "";

    const treatmentsRequest = this.treatmentsService.getTreatmentsByDoctorId(this.doctorId);
    treatmentsRequest.subscribe(
      (treatments) => {
        this.currentTreatments = [];

        treatments.forEach((treatment: any) => {
          this.patientService.getProfileById(treatment.patientId).subscribe(
            (patient) => {

              if (!treatment.length) {
                console.error('No se encontraron tratamientos');
              }

              const enrichedTreatment = {
                ...treatment,
                patientName: `${patient.firstName} ${patient.lastName}`
              };
              this.currentTreatments.push(enrichedTreatment);
            },
            (error) => {
              console.error(`Error al obtener paciente con ID ${treatment.patientId}:`, error);
              const enrichedTreatment = {
                ...treatment,
                patientName: 'Unknown'
              };
              this.currentTreatments.push(enrichedTreatment);
            }
          );
        });
        this.errorMessage = '';
      },
      (error) => {
        this.errorMessage = 'Error loading treatments. Please try again later.';
        console.error('Error:', error);
      }
    );
  }

  loadPatients() {
    this.patientService.getProfiles().subscribe(
      (patients) => {
        this.patients = patients.map((patient) => ({
          ...patient,
          fullName: `${patient.firstName} ${patient.lastName}` // Agregar nombre completo
        }));
      },
      (error) => {
        console.error('Error loading patients:', error);
      }
    );
  }


  onSubmit() {
    if (this.treatmentForm.valid) {
      const treatment: Treatment = {
        id: 0,
        treatmentName: this.treatmentForm.get('treatmentName')?.value,
        description: this.treatmentForm.get('description')?.value,
        startDate: this.treatmentForm.get('startDate')?.value,
        endDate: this.treatmentForm.get('endDate')?.value,
        patientId: this.treatmentForm.get('patientId')?.value,
        doctorId: Number(this.authenticationService.getId()),
      };

      this.treatmentsService.createTreatment(treatment).subscribe(
        (response) => {
          this.successMessage = 'Treatment added successfully!';
          this.loadTreatments();
          this.treatmentForm.reset();
          this.showAddForm = false;
          setTimeout(() => this.successMessage = '', 3000);
          console.log('Treatment added:', response);
        },
        (error) => {
          this.errorMessage = 'Error adding treatment. Please try again.';
          console.error('Error:', error);
        }
      );
    }
  }

  deleteTreatment(treatmentName: string) {
    if (confirm('Are you sure you want to delete this treatment?')) {
      this.treatmentsService.deleteTreatmentByName(treatmentName).subscribe(
        () => {
          this.successMessage = 'Treatment deleted successfully!';
          this.loadTreatments();
          setTimeout(() => this.successMessage = '', 3000);
        },
        (error) => {
          this.errorMessage = 'Error deleting treatment. Please try again.';
          console.error('Error:', error);
        }
      );
    }
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.treatmentForm.reset();
    }
    this.errorMessage = '';
  }
}
