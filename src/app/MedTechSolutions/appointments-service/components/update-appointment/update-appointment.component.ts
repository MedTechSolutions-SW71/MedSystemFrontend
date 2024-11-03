import { Component } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {AppointmentsService} from '../../services/appointments.service';

@Component({
  selector: 'app-update-appointment',
  templateUrl: './update-appointment.component.html',
  styleUrl: './update-appointment.component.css'
})
export class UpdateAppointmentComponent {
  appointmentId: number = -1;
  date: Date | null = null;

  constructor(private appointmentService: AppointmentsService,
              private route: ActivatedRoute,
              private location: Location,) {}

  onDateSelected(event: Date | null): void {
    this.date = event; // Actualiza la fecha seleccionada
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.appointmentId = +id;
      }
    });
  }

  onSubmit(): void {
    if (this.date) {
      const updatedData = {
        date: this.date
      };

      this.appointmentService.updateAppointmentDate(this.appointmentId, updatedData).subscribe(
        response => {
          console.log('Examen actualizado correctamente:', response);
          this.location.back();
        },
        error => {
          console.error('Error al actualizar el examen:', error);
        }
      );
    }
  }

  goBack(): void {
    this.location.back();
  }

}
