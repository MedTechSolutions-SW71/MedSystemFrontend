import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '../../../../shared/component/base-form.component';
import { Doctor } from '../../../profiles-service/model/doctor';
import { Patient } from '../../../profiles-service/model/patient';
import { DoctorService } from '../../../profiles-service/services/doctor.service';
import { PatientService } from '../../../profiles-service/services/patient.service';
import { SignUpRequest } from '../../model/sign-up.request';
import { AuthenticationService } from '../../service/authentication.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent extends BaseFormComponent implements OnInit {
  loginError: string = '';
  roleSelected: string = '';
  userID: number = 0;
  email: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';
  phoneNumber: string = '';
  licenceNumber: string = '';
  specialities: string = '';
  age: string = '';
  address: string = '';
  isLoading = false;

  constructor(
    private authenticationService: AuthenticationService,
    private doctorService: DoctorService,
    private patientService: PatientService
  ) {
    super();
  }

  ngOnInit(): void {}

  doctorSelected(): void {
    this.roleSelected = 'Doctor';
    console.log('DOCTOR SELECTED');
  }

  patientSelected(): void {
    this.roleSelected = 'Patient';
    console.log('PATIENT SELECTED');
  }

  getRole(): number {
    return this.roleSelected === 'Doctor' ? 1 : this.roleSelected === 'Patient' ? 2 : 0;
  }

  onSubmit(): void {
    this.isLoading = true;

    const signUpRequest = new SignUpRequest(this.email, this.password, this.roleSelected);
    this.authenticationService
      .signUp(signUpRequest)
      .then(() => {
        this.authenticationService.currentUserId.subscribe((id) => {
          this.userID = id;
          this.updateProfile();
        });
      })
      .catch((error) => {
        console.error('Sign-up failed:', error);
        this.loginError = 'Sign-up failed. Please try again.';
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  updateProfile(): void {
    if (this.getRole() === 1) {
      // Doctor profile
      const doctor: Doctor = {
        id: this.userID,
        firstName: this.firstName,
        lastName: this.lastName,
        licenceNumber: parseInt(this.licenceNumber),
        specialities: this.specialities,
        phone: this.phoneNumber,
        email: this.email,
      };
      this.doctorService.updateProfile(this.userID, doctor).subscribe(
        (response) => console.log('Doctor profile created:', response),
        (error) => console.error('Error creating doctor profile:', error)
      );
    } else if (this.getRole() === 2) {
      // Patient profile
      const patient: Patient = {
        id: this.userID,
        firstName: this.firstName,
        lastName: this.lastName,
        age: parseInt(this.age),
        address: this.address,
        phone: this.phoneNumber,
        email: this.email,
      };
      this.patientService.updateProfile(this.userID, patient).subscribe(
        (response) => console.log('Patient profile created:', response),
        (error) => console.error('Error creating patient profile:', error)
      );
    }
  }
}
