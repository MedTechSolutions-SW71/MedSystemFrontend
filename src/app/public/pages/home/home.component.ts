import { Component } from '@angular/core';
import { AuthenticationService } from '../../../MedTechSolutions/security-service/service/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  username: string = ''; // Nombre del usuario obtenido del email.
  role: string = ''; // Rol del usuario (Doctor, Patient, etc.).

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    // Obtener el nombre de usuario y el rol al inicializar el componente.
    this.username = this.authenticationService.getUsername() || 'Usuario';
    this.role = this.authenticationService.getRole() || 'User';
  }
}
