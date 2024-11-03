import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Doctor} from '../../../profiles-service/model/doctor';
import {Patient} from '../../../profiles-service/model/patient';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {DoctorService} from '../../../profiles-service/services/doctor.service';
import {PatientService} from '../../../profiles-service/services/patient.service';

import {Exam} from '../../model/exam';
import {Router} from '@angular/router';
import {ExamsService} from '../../service/exams.service';

@Component({
  selector: 'app-exams-laboratory',
  templateUrl: './exams-laboratory.component.html',
  styleUrl: './exams-laboratory.component.css'
})
export class ExamsLaboratoryComponent implements OnInit, AfterViewInit {

  isEditMode: boolean = false;
  doctors: Doctor;
  patients: Patient;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['doctor', 'patient', 'examType', 'examDate', 'examResultDate','examResultsUrl', 'examResultReady' ,'actions'];
  doctorId: string | null = "";
  patientId: string | null = "";
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false}) sort!: MatSort;
  constructor(private router: Router,
              private doctorService: DoctorService,
              private patientService: PatientService,
              private examsService: ExamsService) {
    this.dataSource = new MatTableDataSource<any>();
    this.isEditMode = false;
    this.doctors = {} as Doctor;
    this.patients = {} as Patient;
  }


 private getLaboratoryExams() {
  this.examsService.getExams().subscribe(exams => {
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


    exams.forEach((exam: Exam) => {
      this.doctorService.getProfileById(exam.doctorId).subscribe(doctor => {
        this.dataSource.data = this.dataSource.data.map((appt: any) => {
          if (appt.doctorId === exam.doctorId) {
            return {
              ...appt,
              doctorName: `${doctor.firstName} ${doctor.lastName}`
            };
          }
          return appt;
        });
      });

      this.patientService.getProfileById(exam.patientId).subscribe(patient => {
        this.dataSource.data = this.dataSource.data.map((appt: any) => {
          if (appt.patientId === exam.patientId) {
            return {
              ...appt,
              patientName: `${patient.firstName} ${patient.lastName}`
            };
          }
          return appt;
        });
      });
    });
  }, error => {
    console.error('Error al obtener los exámenes:', error);
  });
}


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getLaboratoryExams();
  }

   onEditItem(element: any): void {
    this.router.navigate(['/update-exam', element.id]);
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
