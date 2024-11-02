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

const routes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'home', component: HomeComponent, canActivate: [authenticationGuard] },
  { path: 'doctor/:id/appointments', component: AppointmentsDoctorComponent, canActivate: [authenticationGuard] },
  { path: 'patient/:id/appointments', component: AppointmentsPatientComponent, canActivate: [authenticationGuard] },
  { path: 'add-appointment', component: AddAppointmentComponent, canActivate: [authenticationGuard] },
  { path: 'chat/:userId', component: ChatComponent, canActivate: [authenticationGuard] },
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
