import {Component, OnInit} from '@angular/core';
import {Result} from '../../models/result';
import {Treatment} from '../../models/treatment';
import {TreatmentsService} from '../../services/treatments.service';
import {Report} from '../../models/report';

@Component({
  selector: 'app-patient-treatments',
  templateUrl: './patient-treatments.component.html',
  styleUrl: './patient-treatments.component.css'
})
export class PatientTreatmentsComponent implements OnInit {
  patientId: number = 1; // Este valor debería venir del servicio de autenticación
  treatments: Treatment[] = [];
  results: Result[] = [];
  reports: Report[] = [];
  selectedTreatment: Treatment | null = null;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private treatmentsService: TreatmentsService) {}

  ngOnInit() {
    this.loadPatientData();
  }

  loadPatientData() {
    this.loading = true;
    const treatmentsRequest = this.treatmentsService.getTreatmentsByPatientId(this.patientId);
    const resultsRequest = this.treatmentsService.getResultsByPatientId(this.patientId);
    const reportsRequest = this.treatmentsService.getReportsByPatientId(this.patientId);

    // Carga de tratamientos
    treatmentsRequest.subscribe(
      (treatments) => {
        this.treatments = treatments;
        this.loading = false;
      },
      (error) => {
        this.errorMessage = 'Error loading treatments';
        this.loading = false;
        console.error('Error:', error);
      }
    );

    // Carga de resultados
    resultsRequest.subscribe(
      (results) => {
        this.results = results;
      },
      (error) => {
        console.error('Error loading results:', error);
      }
    );

    // Carga de reportes
    reportsRequest.subscribe(
      (reports) => {
        this.reports = reports;
      },
      (error) => {
        console.error('Error loading reports:', error);
      }
    );
  }

  selectTreatment(treatment: Treatment) {
    this.selectedTreatment = treatment;
  }

  getTreatmentResults(treatmentId: number): Result[] {
    return this.results.filter(result => result.patientId === this.patientId);
  }

  getTreatmentReports(treatmentId: number): Report[] {
    return this.reports.filter(report => report.patientId === this.patientId);
  }
}
