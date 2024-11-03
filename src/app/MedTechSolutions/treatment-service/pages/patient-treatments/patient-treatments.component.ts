import {Component, OnInit} from '@angular/core';
import {Result} from '../../models/result';
import {Treatment} from '../../models/treatment';
import {TreatmentsService} from '../../services/treatments.service';
import {Report} from '../../models/report';
import {ActivatedRoute} from '@angular/router';

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

  constructor(private treatmentsService: TreatmentsService,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.loadPatientData();
    this.route.paramMap.subscribe(params => {
      this.patientId = Number(params.get('id')); // Captura el ID de la URL
    });
  }

  loadPatientData() {
    this.loading = true;
    const treatmentsRequest = this.treatmentsService.getTreatmentsByPatientId(this.patientId);
    const resultsRequest = this.treatmentsService.getResultsByPatientId(this.patientId);
    const reportsRequest = this.treatmentsService.getReportsByPatientId(this.patientId);

    // Carga de tratamientos
    treatmentsRequest.subscribe(
      (response) => {
        console.log('Respuesta de treatmentsRequest:', response);

        // Accede a la propiedad que contiene el array de tratamientos.
        if (response && Array.isArray(response)) {
          this.treatments = response;// Ajusta `treatments` según la propiedad real
        } else {
          this.treatments = []; // Asignación vacía si no se encuentra el array
          console.error('La respuesta no contiene un array de tratamientos:', response);
        }

        this.loading = false;
      },
      (error) => {
        this.errorMessage = 'Error loading treatments';
        this.loading = false;
        console.error('Error:', error);
      }
    );


    // Carga de resultados


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
