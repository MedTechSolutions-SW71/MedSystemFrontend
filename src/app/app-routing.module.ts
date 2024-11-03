import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChatComponent} from './MedTechSolutions/chat-service/components/chat/chat.component';
import {SignInComponent} from './MedTechSolutions/security-service/pages/sign-in/sign-in.component';
import {SignUpComponent} from './MedTechSolutions/security-service/pages/sign-up/sign-up.component';
import {authenticationGuard} from './MedTechSolutions/security-service/service/authentication.guard';
import {HomeComponent} from './public/pages/home/home.component';
import {AppointmentsDoctorComponent} from './MedTechSolutions/appointments-service/pages/doctor/appointments-doctor.component';
import {
  AppointmentsPatientComponent
} from './MedTechSolutions/appointments-service/pages/patients/appointments-patient.component';
import {
  AddAppointmentComponent
} from './MedTechSolutions/appointments-service/components/add-appointment/add-appointment.component';
import {ExamsDoctorComponent} from './MedTechSolutions/exams-service/pages/doctor/exams-doctor.component';
import {AddExamComponent} from './MedTechSolutions/exams-service/components/add-exam/add-exam.component';
import {UpdateExamComponent} from './MedTechSolutions/exams-service/components/update-exam/update-exam.component';
import {ExamsLaboratoryComponent} from './MedTechSolutions/exams-service/pages/laboratory/exams-laboratory.component';
import {ExamsPatientComponent} from './MedTechSolutions/exams-service/pages/patient/exams-patient.component';

const routes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'home', component: HomeComponent, canActivate: [authenticationGuard] },
  { path: 'doctor/:id/appointments', component: AppointmentsDoctorComponent, canActivate: [authenticationGuard] },
  { path: 'patient/:id/appointments', component: AppointmentsPatientComponent, canActivate: [authenticationGuard] },
  { path: 'add-appointment', component: AddAppointmentComponent, canActivate: [authenticationGuard] },
  { path: 'add-exam', component: AddExamComponent, canActivate: [authenticationGuard] },
  { path: 'update-exam/:id', component: UpdateExamComponent, canActivate: [authenticationGuard] },
  { path: 'laboratory/:id/exams', component: ExamsLaboratoryComponent, canActivate: [authenticationGuard] },
  { path: 'doctor/:id/exams', component: ExamsDoctorComponent, canActivate: [authenticationGuard] },
  { path: 'patient/:id/exams', component: ExamsPatientComponent, canActivate: [authenticationGuard] },
  { path: 'chat/:userId', component: ChatComponent, canActivate: [authenticationGuard] },
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
