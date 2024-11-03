import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../../shared/services/base.service';
import { Treatment} from '../models/treatment';
import { Result } from '../models/result';
import { Report } from '../models/report';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TreatmentsService {

  private treatmentsEndpoint = `${environment.treatmentsPath}/api/v1/treatments`;
  private resultsEndpoint = `${environment.treatmentsPath}/api/v1/results`;
  private reportsEndpoint = `${environment.treatmentsPath}/api/v1/reports`;

  constructor(private http: HttpClient) {}

  getTreatments() {
    return this.http.get<Treatment[]>(this.treatmentsEndpoint);
  }

  addTreatment(treatment: Treatment) {
    return this.http.post<Treatment>(this.treatmentsEndpoint, treatment);
  }

  getTreatmentsByPatientId(patientId: number) {
    return this.http.get<Treatment[]>(`${this.treatmentsEndpoint}/patientId/${patientId}`);
  }

  deleteTreatmentByName(treatmentName: string) {
    return this.http.delete(`${this.treatmentsEndpoint}/treatmentName/${treatmentName}`);
  }

  // Métodos para Result
  getResults() {
    return this.http.get<Result[]>(this.resultsEndpoint);
  }

  addResult(result: Result) {
    return this.http.post<Result>(this.resultsEndpoint, result);
  }

  getResultsByPatientId(patientId: number) {
    return this.http.get<Result[]>(`${this.resultsEndpoint}/patientId/${patientId}`);
  }

  getResultsByDoctorId(doctorId: number) {
    return this.http.get<Result[]>(`${this.resultsEndpoint}/doctorId/${doctorId}`);
  }

  // Métodos para Report
  getReports() {
    return this.http.get<Report[]>(this.reportsEndpoint);
  }

  addReport(report: Report) {
    return this.http.post<Report>(this.reportsEndpoint, report);
  }

  getReportById(id: number) {
    return this.http.get<Report>(`${this.reportsEndpoint}/${id}`);
  }

  getReportsByPatientId(patientId: number) {
    return this.http.get<Report[]>(`${this.reportsEndpoint}/patientId/${patientId}`);
  }
}
