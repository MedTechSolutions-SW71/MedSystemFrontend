export class Appointment {
  id: number;
  doctorId: number;
  patientId: number;
  date: string;
  reason: string;
  speciality: string;
  constructor() {
    this.id = 0;
    this.doctorId = 0
    this.patientId = 0;
    this.date = "";
    this.reason = "";
    this.speciality = "";
  }
}
