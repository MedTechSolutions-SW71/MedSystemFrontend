import { Injectable } from '@angular/core';
import {BaseService} from '../../../shared/services/base.service';
import {HttpClient} from '@angular/common/http';
import {Doctor} from '../model/doctor';

@Injectable({
  providedIn: 'root'
})
export class DoctorService extends BaseService<Doctor> {

  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = '/api/v1/doctors';
  }
}
