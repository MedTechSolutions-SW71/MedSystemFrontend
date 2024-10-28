import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../service/authentication.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {BaseFormComponent} from '../../../../shared/component/base-form.component';
import {SignInRequest} from '../../model/sign-in.request';
import {Router} from "@angular/router";


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent extends BaseFormComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  loginError: string = '';
  useRole: string = '';




  constructor(private builder: FormBuilder, private authenticationService: AuthenticationService, private router: Router) {
    super();
  }

  navigateToSignUp(){
    this.router.navigate(['/sign-up']);
  }



  ngOnInit(): void {
    this.form = this.builder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.loginError = '';




    if (this.form.invalid) return;

    const signInRequest = new SignInRequest(
        this.form.value.email,
        this.form.value.password
    );



    this.authenticationService.signIn(signInRequest).subscribe({
      next: (response) => {
        localStorage.setItem('email', response.username);
        localStorage.setItem('role', response.role);
        // Guardamos el token en el localStorage y redirigimos a la aplicación principal
        this.authenticationService.verification(response.token, response.username, response.role);  // Aquí se actualiza el estado de autenticación
        console.log('Respuesta del servidor:', response);
        console.log('Email guardado en localStorage:', response.username);
        console.log('Token guardado en localStorage:', response.token);
        console.log('Roles guardados en localStorage:', response.role);
      },
      error: (err) => {
        // Si hay un error, mostramos un mensaje de error
        console.error('Error durante el login:', err);
        this.loginError = 'Invalid email or password. Please try again';
      }
    });


  }
}
