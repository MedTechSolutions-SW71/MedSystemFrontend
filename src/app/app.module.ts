import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './MedTechSolutions/chat-service/components/chat/chat.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SignInComponent} from './MedTechSolutions/security-service/pages/sign-in/sign-in.component';
import {SignUpComponent} from './MedTechSolutions/security-service/pages/sign-up/sign-up.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from '@angular/material/sidenav';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatIcon} from '@angular/material/icon';
import {provideHttpClient} from '@angular/common/http';
import {MatAnchor, MatIconButton} from "@angular/material/button";
import { HomeComponent } from './public/pages/home/home.component';

import { DoctorTreatmentsComponent } from './MedTechSolutions/treatment-service/pages/doctor-treatments/doctor-treatments.component';
import { PatientTreatmentsComponent } from './MedTechSolutions/treatment-service/pages/patient-treatments/patient-treatments.component';


@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    SignInComponent,
    SignUpComponent,
    HomeComponent,

    DoctorTreatmentsComponent,
    PatientTreatmentsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIcon,
    MatAnchor,
    MatIconButton
  ],
  providers: [
    provideHttpClient(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
