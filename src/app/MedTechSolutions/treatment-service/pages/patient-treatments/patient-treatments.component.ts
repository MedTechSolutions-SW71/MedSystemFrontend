import {Component, OnInit} from '@angular/core';
import {Treatment} from '../../models/treatment';
import {TreatmentsService} from '../../services/treatments.service';
import {ActivatedRoute} from '@angular/router';
import {AuthenticationService} from '../../../security-service/service/authentication.service';

@Component({
  selector: 'app-patient-treatments',
  templateUrl: './patient-treatments.component.html',
  styleUrl: './patient-treatments.component.css'
})
export class PatientTreatmentsComponent implements OnInit {
  patientId: string | null = "";
  treatments: Treatment[] = [];
  selectedTreatment: Treatment | null = null;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private treatmentsService: TreatmentsService,
              private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.loadPatientData();

  }

  loadPatientData() {
    this.loading = true;
    this.patientId = this.authenticationService.getId() ? this.authenticationService.getId() : "";
    const treatmentsRequest = this.treatmentsService.getTreatmentsByPatientId(this.patientId);

    treatmentsRequest.subscribe(
      (response) => {
        console.log('Respuesta de treatmentsRequest:', response);

        if (response && Array.isArray(response)) {
          this.treatments = response;
        } else {
          this.treatments = [];
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

  }

  selectTreatment(treatment: Treatment) {
    this.selectedTreatment = treatment;
  }


}
