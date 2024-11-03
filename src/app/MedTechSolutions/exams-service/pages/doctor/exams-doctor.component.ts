import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Doctor} from '../../../profiles-service/model/doctor';
import {Patient} from '../../../profiles-service/model/patient';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {AppointmentsService} from '../../../appointments-service/services/appointments.service';
import {DoctorService} from '../../../profiles-service/services/doctor.service';
import {PatientService} from '../../../profiles-service/services/patient.service';
import {AuthenticationService} from '../../../security-service/service/authentication.service';
import {Appointment} from '../../../appointments-service/model/appointment';
import {ExamsService} from '../../service/exams.service';
import {Exam} from '../../model/exam';
import {Router} from '@angular/router';

@Component({
  selector: 'app-exams-doctor',
  templateUrl: './exams-doctor.component.html',
  styleUrl: './exams-doctor.component.css'
})
export class ExamsDoctorComponent implements OnInit, AfterViewInit {

  doctors: Doctor;
  patients: Patient;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['doctor', 'patient', 'examType', 'examDate', 'examResultDate', 'examResultsReady'];
  doctorId: string | null = "";
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false}) sort!: MatSort;

  constructor(private examsService: ExamsService, private doctorService: DoctorService, private patientService: PatientService, private authenticationService: AuthenticationService, private router: Router) {
    this.dataSource = new MatTableDataSource<any>();
    this.doctors = {} as Doctor;
    this.patients = {} as Patient;
  }

  private getDoctorExams() {
    this.doctorId = this.authenticationService.getId() ? this.authenticationService.getId() : "";
    if (this.doctorId != null) {
      this.examsService.getExamByDoctorId(parseInt(this.doctorId),'doctor').subscribe(exams => {
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

        if (this.doctorId != null) {
          this.doctorService.getProfileById(parseInt(this.doctorId)).subscribe(doctors => {
            this.doctors = doctors;
            console.log('Doctores obtenidos:', doctors);

            this.dataSource.data = this.dataSource.data.map((exam: any) => {
              return {
                ...exam,
                doctorName: `${this.doctors.firstName} ${this.doctors.lastName}`
              };
            });
          });
        }

        exams.forEach((exam: Exam) => {
          this.patientService.getProfileById(exam.patientId).subscribe(patients => {
            this.patients = patients;
            console.log('Pacientes obtenidos:', patients);

            this.dataSource.data = this.dataSource.data.map((ex: any) => {
              if (ex.patientId === exam.patientId) {
                return {
                  ...ex,
                  patientName: `${patients.firstName} ${patients.lastName}`
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

  goToCreateExam(): void {
    this.router.navigate(['/add-exam']); // Cambia la ruta según la configuración de tu enrutador
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getDoctorExams();
  }
}
