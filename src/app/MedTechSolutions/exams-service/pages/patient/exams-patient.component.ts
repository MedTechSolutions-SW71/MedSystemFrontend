import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Doctor} from '../../../profiles-service/model/doctor';
import {Patient} from '../../../profiles-service/model/patient';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {ExamsService} from '../../service/exams.service';
import {DoctorService} from '../../../profiles-service/services/doctor.service';
import {PatientService} from '../../../profiles-service/services/patient.service';
import {AuthenticationService} from '../../../security-service/service/authentication.service';
import {Router} from '@angular/router';
import {Exam} from '../../model/exam';

@Component({
  selector: 'app-exams-patient',
  templateUrl: './exams-patient.component.html',
  styleUrl: './exams-patient.component.css'
})
export class ExamsPatientComponent  implements OnInit, AfterViewInit {

  doctors: Doctor;
  patients: Patient;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['doctor', 'patient', 'examType', 'examDate', 'examResultDate', 'examResultsUrl', 'examResultsReady'];
  patientId: string | null = "";
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false}) sort!: MatSort;

  constructor(private examsService: ExamsService,
              private doctorService: DoctorService,
              private patientService: PatientService,
              private authenticationService: AuthenticationService,
              private router: Router) {
    this.dataSource = new MatTableDataSource<any>();
    this.doctors = {} as Doctor;
    this.patients = {} as Patient;
  }

  private getPatientExams() {
    this.patientId = this.authenticationService.getId() ? this.authenticationService.getId() : "";
    if (this.patientId != null) {
      this.examsService.getExamByPatientId(parseInt(this.patientId),'patient').subscribe(exams => {
        console.log('Exámenes obtenidos:', exams);

        if (!exams.length) {
          console.error('No se encontraron exámenes');
        }

        this.dataSource.data = exams.map((exam: any) => {
          return {
            ...exam,
            doctorName: '',
            patientName: ''
          };
        });

        if (this.patientId != null) {
          this.patientService.getProfileById(parseInt(this.patientId)).subscribe(patients => {
            this.patients = patients;
            console.log('Doctores obtenidos:', patients);

            this.dataSource.data = this.dataSource.data.map((exam: any) => {
              return {
                ...exam,
                doctorName: `${this.patients.firstName} ${this.patients.lastName}`
              };
            });
          });
        }

        exams.forEach((exam: Exam) => {
          this.doctorService.getProfileById(exam.doctorId).subscribe(doctors => {
            this.doctors = doctors;
            console.log('Doctors obtenidos:', doctors);

            this.dataSource.data = this.dataSource.data.map((ex: any) => {
              if (ex.doctorId === exam.doctorId) {
                return {
                  ...ex,
                  patientName: `${doctors.firstName} ${doctors.lastName}`
                };
              }
              return ex;
            });
          });
        });
      }, error => {
        console.error('Error al obtener datos:', error);
      });
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getPatientExams();
  }

  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }

}
