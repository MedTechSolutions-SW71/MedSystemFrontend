import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../../shared/services/base.service';
import { Treatment} from '../models/treatment';

@Injectable({
  providedIn: 'root'
})
export class TreatmentsService extends BaseService<Treatment>{

  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = '/api/v1/treatments';
  }
}
