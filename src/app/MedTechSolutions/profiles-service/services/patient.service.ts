import { Injectable } from '@angular/core';
import {BaseService} from '../../../shared/services/base.service';
import {HttpClient} from '@angular/common/http';
import {Patient} from '../model/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService extends BaseService<Patient> {

  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = '/api/v1/patients';
  }

}
