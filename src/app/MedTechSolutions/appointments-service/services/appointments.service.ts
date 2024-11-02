import { Injectable } from '@angular/core';
import { BaseService } from "../../../shared/services/base.service";
import { Appointment } from "../model/appointment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService extends BaseService<Appointment> {

  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = '/api/v1/appointments';
  }

}
