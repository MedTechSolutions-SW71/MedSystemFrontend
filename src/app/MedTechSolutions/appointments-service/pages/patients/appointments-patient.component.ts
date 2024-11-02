  import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
  import {MatTableDataSource} from "@angular/material/table";
  import {MatPaginator} from "@angular/material/paginator";
  import {MatSort} from "@angular/material/sort";
  import {Appointment} from '../../model/appointment';
  import {AppointmentsService} from '../../services/appointments.service';
  import {DoctorService} from '../../../profiles-service/services/doctor.service';
  import {Doctor} from '../../../profiles-service/model/doctor';
  import {Patient} from '../../../profiles-service/model/patient';
  import {PatientService} from '../../../profiles-service/services/patient.service';
  import {AuthenticationService} from '../../../security-service/service/authentication.service';
  import {Router} from '@angular/router';

  @Component({
    selector: 'app-appointments',
    templateUrl: './appointments-patient.component.html',
    styleUrls: ['./appointments-patient.component.css']
  })
  export class AppointmentsPatientComponent implements OnInit, AfterViewInit {

    // Attributes
    doctors: Doctor;
    patients: Patient;
    dataSource: MatTableDataSource<any>;
    displayedColumns: string[] = ['doctor', 'patient', 'date', 'reason', 'speciality', 'actions'];
    doctorId: string | null = "";
    patientId: string | null = "";
    appointmentData: Appointment;

    @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
    @ViewChild(MatSort, { static: false}) sort!: MatSort;
    isEditMode: boolean;
    constructor(private router: Router ,private appointmentsService: AppointmentsService, private doctorService: DoctorService, private patientService: PatientService, private authenticationService: AuthenticationService) {
      this.dataSource = new MatTableDataSource<any>();
      this.isEditMode = false;
      this.doctors = {} as Doctor;
      this.patients = {} as Patient;
      this.appointmentData = {} as Appointment

    }


   private getPatientAppointments() {
    this.patientId = this.authenticationService.getId() ? this.authenticationService.getId() : "";
    if (this.patientId != null) {
      this.appointmentsService.getByOtherId(parseInt(this.patientId), "patientId").subscribe(appointments => {
        console.log('Citas obtenidas:', appointments);

        if (!appointments.length) {
          console.error('No se encontraron citas');
        }

        this.dataSource.data = appointments.map((appointment: any) => {
          return {
            ...appointment,
            doctorName: '',
            patientName: ''
          };
        });

        if (this.patientId != null) {
          this.patientService.getProfileById(parseInt(this.patientId)).subscribe(patients => {
            this.patients = patients;
            console.log('Pacientes obtenidos:', patients);

            this.dataSource.data = this.dataSource.data.map((appointment: any) => {
              return {
                ...appointment,
                patientName: `${this.patients.firstName} ${this.patients.lastName}`
              };
            });
          });
        }

        appointments.forEach((appointment: Appointment) => {
          this.doctorService.getProfileById(appointment.doctorId).subscribe(doctors => {
            this.doctors = doctors;
            console.log('Doctor obtenidos:', doctors);

            this.dataSource.data = this.dataSource.data.map((appt: any) => {
              if (appt.doctorId === appointment.doctorId) {
                return {
                  ...appt,
                  doctorName: `${doctors.firstName} ${doctors.lastName}`
                };
              }
              return appt;
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
      this.getPatientAppointments();
    }

    onAddAppointment() {
      this.router.navigate(['/add-appointment']);
    }

    private deleteAppointment(id: number) {
      this.appointmentsService.deleteAppointment(id).subscribe(() => {
        this.dataSource.data = this.dataSource.data.filter((appointment: Appointment) => appointment.id !== id);
        console.log('Cita eliminada y tabla actualizada');
      }, (error) => {
        console.error('Error al eliminar la cita:', error); // Imprime todo el objeto de error
        alert('Error al eliminar la cita. Por favor, inténtalo de nuevo.');
      });
    }

    onDeleteItem(element: Appointment) {
      const confirmation = window.confirm('¿Estás seguro de querer eliminar la cita?');
      if (confirmation) {
        this.deleteAppointment(element.id);
      }
    }
  }
