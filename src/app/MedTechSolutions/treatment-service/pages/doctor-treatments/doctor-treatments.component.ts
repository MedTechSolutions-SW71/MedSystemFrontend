import {Component, OnInit} from '@angular/core';
import {Treatment} from '../../models/treatment';
import {TreatmentsService} from '../../services/treatments.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Appointment} from "../../../appointments-service/model/appointment";

@Component({
  selector: 'app-doctor-treatments',
  templateUrl: './doctor-treatments.component.html',
  styleUrl: './doctor-treatments.component.css'
})

export class DoctorTreatmentsComponent implements OnInit {
  doctorId: number = 1;
  currentTreatments: Treatment[] = [];
  treatmentForm: FormGroup;
  showAddForm = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private treatmentsService: TreatmentsService,
    private fb: FormBuilder,
    private route: ActivatedRoute
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

  }

  loadTreatments() {
    this.treatmentsService.getTreatments().subscribe(
      (treatments) => {
        this.currentTreatments = treatments;
        this.errorMessage = '';
      },
      (error) => {
        this.errorMessage = 'Error loading treatments. Please try again later.';
        console.error('Error:', error);
      }
    );
  }

  onSubmit() {
    if (this.treatmentForm.valid) {
      const treatment: Treatment = {
        id: 0, // El backend asignará el ID real
        treatmentName: this.treatmentForm.get('treatmentName')?.value,
        description: this.treatmentForm.get('description')?.value,
        startDate: this.treatmentForm.get('startDate')?.value,
        endDate: this.treatmentForm.get('endDate')?.value,
        patientId: this.treatmentForm.get('patientId')?.value
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
