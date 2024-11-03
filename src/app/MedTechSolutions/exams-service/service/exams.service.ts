import { Injectable } from '@angular/core';
import {Exam} from '../model/exam';
import {BaseService} from '../../../shared/services/base.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExamsService extends BaseService<Exam>{

  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = '/api/v1/exams';
  }
}
