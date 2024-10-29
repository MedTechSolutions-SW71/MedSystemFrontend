import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Appointment} from '../../model/appointment';
import {AppointmentsService} from '../../services/appointments.service';
import {forkJoin} from "rxjs";
import {DoctorService} from '../../../profiles-service/services/doctor.service';
import {Doctor} from '../../../profiles-service/model/doctor';
import {Patient} from '../../../profiles-service/model/patient';
import {PatientService} from '../../../profiles-service/services/patient.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments-doctor.component.html',
  styleUrls: ['./appointments-doctor.component.css']
})
export class AppointmentsDoctorComponent implements OnInit, AfterViewInit {

  // Attributes
  doctors: Doctor[] = [];
  patients: Patient[] = [];
  appointmentData: Appointment;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['doctor', 'patient', 'date', 'reason', 'speciality'];
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false}) sort!: MatSort;
  isEditMode: boolean;
  constructor(private appointmentsService: AppointmentsService, private doctorService: DoctorService, private patientService: PatientService) {
    this.appointmentData = {} as Appointment;
    this.dataSource = new MatTableDataSource<any>();
    this.isEditMode = false;
  }

  // Private methods
  private resetEditState() {
    this.isEditMode = false;
    this.appointmentData = {} as Appointment;
  }

  // CRUD Actions

  private getAllAppointments() {
    // Ejecutar todas las solicitudes al mismo tiempo
    forkJoin({
      appointments: this.appointmentsService.getAppointments(),
      doctors: this.doctorService.getProfiles(),
      patients: this.patientService.getProfiles()
    }).subscribe(({ appointments, doctors, patients }) => {
      console.log('Citas obtenidas:', appointments);
      console.log('Doctores obtenidos:', doctors);
      console.log('Pacientes obtenidos:', patients);

      // Verificar que los datos no estén vacíos
      if (!appointments.length) {
        console.error('No se encontraron citas');
      }
      if (!doctors.length) {
        console.error('No se encontraron doctores');
      }
      if (!patients.length) {
        console.error('No se encontraron pacientes');
      }

      // Asignar correctamente los doctores y pacientes a las variables locales
      this.doctors = doctors;
      this.patients = patients;
      console.log('Doctores:', this.doctors);

      console.log('prueba: ', this.doctors.find(d => d.id = appointments[0].doctorId));

      // Mapear las citas
      this.dataSource.data = appointments.map((appointment: any) => {
        const doctor = this.doctors.find(d => d.id == +appointment.doctorId);
        const patient = this.patients.find(p => p.id == +appointment.patientId);

        if (!doctor) {
          console.error(`Doctor con ID ${appointment.doctorId} no encontrado`);
        }
        if (!patient) {
          console.error(`Paciente con ID ${appointment.patientId} no encontrado`);
        }

        return {
          ...appointment,
          doctorName: doctor ? `${doctor.firstName} ${doctor.lastName}` : 'Unknown Doctor',
          patientName: patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient'
        };
      });
    }, error => {
      console.error('Error al obtener datos:', error);
    });
  }

  /*
    private addAppointment() {
      this.appointmentData.id = 0;
      this.appointmentsService.create(this.appointmentData).subscribe((response: any) => {
        this.dataSource.data.push({...response});
        this.dataSource.data = this.dataSource.data.map((s: Appointment) => { return s;});
      });
    }

    private updateAppointment() {
      let appointment = this.appointmentData;
      this.appointmentsService.update(appointment.id, appointment).subscribe((response: any) => {
        this.dataSource.data = this.dataSource.data.map((s: Appointment) => {
          if (s.id === response.id) {
            s = response;
          }
          return s;
        });
      });
    }

    private de(id: number) {
      console.log('Deleting appointment with ID:', id);  // Verifica el ID
      this.appointmentsService.delete(id).subscribe(() => {
        this.dataSource.data = this.dataSource.data.filter((s: Appointment) => s.id !== id);
      });
    }

    private deleteAppointment(id: number) {
      // Eliminar el elemento en memoria, ya que no puedes modificar un JSON local
      this.dataSource.data = this.dataSource.data.filter((appointment: Appointment) => appointment.id !== id);
    } */

  // Component Lifecycle Event Handlers

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getAllAppointments();
  }

}
