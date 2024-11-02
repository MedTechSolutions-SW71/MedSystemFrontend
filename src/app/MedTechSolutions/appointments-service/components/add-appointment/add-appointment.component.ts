import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import {Doctor} from '../../../profiles-service/model/doctor';
import {DoctorService} from '../../../profiles-service/services/doctor.service';
import {AuthenticationService} from '../../../security-service/service/authentication.service';
import {AppointmentsService} from '../../services/appointments.service';

@Component({
  selector: 'app-add-appointment',
  templateUrl: './add-appointment.component.html',
  styleUrls: ['./add-appointment.component.css']
})
export class AddAppointmentComponent implements OnInit {
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  filteredDoctors: Doctor[] = [];
  availableTimes: string[] = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];
  selectedDate!: Date;
  selectedDoctorFirstName: string = '';
  selectedDoctorLastName: string = '';

  constructor(
    private _formBuilder: FormBuilder,
    private location: Location,
    private doctorService: DoctorService,
    private appointmentsService: AppointmentsService,
    private authenticationService: AuthenticationService
  ) {
    this.firstFormGroup = this._formBuilder.group({
      reason: ['', Validators.required],
      speciality: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      doctor: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      date: ['', Validators.required],
      time: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.firstFormGroup.get('speciality')?.valueChanges.subscribe((speciality: string) => {
      if (speciality) {
        this.loadDoctorsBySpeciality(speciality);
      }
    });
    this.secondFormGroup.get('doctor')?.valueChanges.subscribe(doctorId => {
      this.updateDoctorName(doctorId);
    });
  }

  onDateSelected(date: Date | null): void {
    if (date) {
      this.selectedDate = date;
      const formattedDate = date.toISOString().split('T')[0];
      this.thirdFormGroup.get('date')?.setValue(formattedDate);
      console.log('Fecha seleccionada:', formattedDate);
    }
  }


  dateClass = (d: Date): string => {
    if (!this.selectedDate) return ''; // Evita errores si `selectedDate` es `undefined`
    const date = d.toISOString().split('T')[0];
    return date === this.selectedDate.toISOString().split('T')[0] ? 'selected-date' : '';
  }


  createAppointment(): void {
    if (this.firstFormGroup.valid && this.secondFormGroup.valid && this.thirdFormGroup.valid) {
      const appointment = {
        doctorId: this.secondFormGroup.get('doctor')?.value,
        patientId: this.authenticationService.getId(),
        date: this.thirdFormGroup.get('date')?.value, // + 'T' + this.thirdFormGroup.get('time')?.value + ':00', // Combina la fecha y la hora
        reason: this.firstFormGroup.get('reason')?.value,
        speciality: this.firstFormGroup.get('speciality')?.value
      };

      // Llama al servicio de citas para crear la cita
      this.appointmentsService.createAppointment(appointment).subscribe(
        (response) => {
          console.log('Cita creada con éxito:', response);
          alert('Appointment created successfully!');
          this.location.back(); // Regresa a la vista anterior o redirige a donde necesites
        },
        (error) => {
          console.error('Error al crear la cita:', error);
          alert('Failed to create the appointment. Please try again.');
        }
      );
    } else {
      alert('Please fill in all the required fields.');
    }
  }


  private loadDoctorsBySpeciality(speciality: string): void {
    this.doctorService.getBySpecialty(speciality).subscribe((doctors: Doctor[]) => {
      this.filteredDoctors = doctors;
    });
  }


  updateDoctorName(doctorId: string): void {
    const doctor = this.filteredDoctors.find(d => d.id === +doctorId); // Convierte a número si es necesario
    if (doctor) {
      this.selectedDoctorFirstName = doctor.firstName;
      this.selectedDoctorLastName = doctor.lastName;
    }
  }



  goBack(): void {
    this.location.back();
  }
}
