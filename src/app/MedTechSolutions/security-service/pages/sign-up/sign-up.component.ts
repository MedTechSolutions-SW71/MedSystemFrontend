import {Component, OnInit} from '@angular/core';
import {SignUpRequest} from '../../model/sign-up.request';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {BaseFormComponent} from '../../../../shared/component/base-form.component';
import {AuthenticationService} from '../../service/authentication.service';
import {Router} from "@angular/router";
import {DoctorService} from "../../../profiles-service/services/doctor.service";
import {PatientService} from "../../../profiles-service/services/patient.service";
import {Doctor} from "../../../profiles-service/model/doctor";
import {Patient} from "../../../profiles-service/model/patient";
import {jsDocComment} from '@angular/compiler';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent extends BaseFormComponent implements OnInit {
  loginError: string = '';
  roleSelected: string = '';
  submitted = false;
  userID: number = 0;
  email: string = '';
  age: string = '';
  address: string = '';
  specialities: string = '';
  licenceNumber: string = '';
  firstName: string = '';
  lastName: string = '';
  phoneNumber: string = '';
  password: string = '';
  isLoading = false;



  constructor(private authenticationService: AuthenticationService,
              private doctorService: DoctorService,
              private patientService: PatientService) {
    super();
  }

  ngOnInit(): void {

  }

  onSubmit() {


    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
      alert('Registro exitoso');
    }, 3000);

    let username = this.email;
    let password = this.password;
    const signUpRequest = new SignUpRequest(username, password, this.roleSelected);
    this.submitted = true;
    this.authenticationService.signUp(signUpRequest)
      .then(() => {
        this.authenticationService.currentUserId.subscribe(id => this.userID = id);
        this.updateProfile();
      })
      .catch(error => {
        console.error('Sign-up failed:', error);
      });
    console.log('Sign up request:', signUpRequest)


  }

  updateProfile() {
    //CREATE PROFILE
    let firstName = this.firstName;
    let lastName = this.lastName;
    let phone = this.phoneNumber;
    let email = this.email;
    if (this.getRole() === 1) {
      let specialities = this.specialities;
      let licenceNumber = this.licenceNumber;
      console.log("a: ",specialities);
      this.updateDoctor(new Doctor(this.userID, firstName, lastName, parseInt(licenceNumber), specialities, phone, email));
    } else if (this.getRole() === 2) {
      let age = this.age;
      let address = this.address;
      console.log("userId: ", this.userID);
      this.updatePatient(new Patient(this.userID, firstName, lastName, parseInt(age), address, phone, email));
    }


  }

  doctorSelected() {
    this.roleSelected = 'Doctor';
    console.log("DOCTOR SELECTED");
  }

  patientSelected() {
    this.roleSelected = 'Patient';
    console.log("PATIENT SELECTED")
  }

  updateDoctor(doctor: Doctor) {

    const newDoctor = {
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      licenceNumber: doctor.licenceNumber,
      specialities: doctor.specialities,
      phone: doctor.phone,
      email: doctor.email,
    }
    console.log("ab: ", doctor.specialities);
    this.doctorService.updateProfile(this.userID, newDoctor).subscribe(
      response => console.log('Item created successfully:', response),
      error => console.error('Error creating item:', error)
    );
  }

  updatePatient(patient: Patient) {
    console.log("userId: ", this.userID);
    const newPatient = {
      firstName: patient.firstName,
      lastName: patient.lastName,
      age: patient.age,
      address: patient.address,
      phone: patient.phone,
      email: patient.email,
    }
    this.patientService.updateProfile(this.userID, newPatient).subscribe(
      response => console.log('Item created successfully:', response),
      error => console.error('Error creating item:', error)
    );
  }

  getRole(): number {
    if (this.roleSelected === 'Doctor') return 1;
    else if (this.roleSelected === 'Patient') return 2;
    else return 0;
  }
}

