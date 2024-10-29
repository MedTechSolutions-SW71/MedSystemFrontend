import {Component, OnInit,ViewChild} from '@angular/core';
import {AuthenticationService} from './MedTechSolutions/security-service/service/authentication.service';
import {Observable} from 'rxjs';
import {MatSidenav} from '@angular/material/sidenav';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isSignedIn: boolean = false;
  username: string = "";
  userId: number = -1;
  userRole: string = '';

  // Título del toolbar
  title = 'MedTechSolutions';

  @ViewChild('sidenav') sidenav!: MatSidenav;

  // Opciones del menú (basadas en la imagen)
  options = [
    { path: '/home', title: 'Home' },
    { path: '/appointments', title: 'Appointments' },
    { path: '/chat', title: 'Chat' },
    { path: '/treatments', title: 'Treatments for patient' },
    { path: '/history', title: 'Request history' },
    { path: '/results', title: 'Request results' }
  ];

  // Opción seleccionada (puedes usar esto para marcar la opción seleccionada si lo necesitas)
  selectedOption = '/home';

  isSignedIn$!: Observable<boolean>;

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.isSignedIn$ = this.authenticationService.isSignedIn;
  }

  getName(){
    this.authenticationService.currentUsername.subscribe(username => this.username = username);
    console.log(this.username);
  }
  getId(){
    this.authenticationService.currentUserId.subscribe(id => this.userId = id);
  }


  // Método para seleccionar una opción (si deseas manejar la opción seleccionada)
  selectOption(path: string) {
    this.selectedOption = path;
  }

  logout() {
    this.authenticationService.signOut();
  }

}
