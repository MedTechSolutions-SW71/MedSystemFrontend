import {Component, OnInit,ViewChild} from '@angular/core';
import {AuthenticationService} from './MedTechSolutions/security-service/service/authentication.service';
import {Observable} from 'rxjs';
import {MatSidenav} from '@angular/material/sidenav';
import {OptionsService} from './public/services/options.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  username: string = "";
  id: string | null = "";
  userRole: string | null = "";
  title = 'MedTechSolutions';

  @ViewChild('sidenav') sidenav!: MatSidenav;

  options = [
    { path: '/home', title: 'Home', icon: 'home'},
  ];
  selectedOption: string = '/home';
  isSignedIn$!: Observable<boolean>;

  constructor(
    private authenticationService: AuthenticationService,
    private optionsService: OptionsService
  ) {}

  ngOnInit() {
    this.isSignedIn$ = this.authenticationService.isSignedIn;

    this.optionsService.updateOptions$.subscribe(() => {
      this.updateOptions();
    });
  }

  updateOptions() {

    this.userRole = this.authenticationService.getRole();
    console.log("role: " + this.userRole);

    let userIdForPath: string | null = "";

    if (this.userRole === 'Doctor') {
      this.id = this.authenticationService.getId()
        userIdForPath = this.id;
        this.options = [
          { path: '/home', title: 'Home', icon: 'home' },
          { path: `/doctor/${userIdForPath}/appointments`, title: 'Appointments', icon: 'calendar_today' },
          { path: `/doctor/${userIdForPath}/treatments`, title: 'Treatments for patients', icon: 'assignment' },
          { path: `/doctor/${userIdForPath}/exams`, title: 'Exams', icon: 'swap_vertical_circle' },
        ];
    } else if (this.userRole === 'Patient') {
      this.id = this.authenticationService.getId()
      userIdForPath = this.id;
      this.options = [
        {path: '/home', title: 'Home', icon: 'home'},
        {path: `/patient/${userIdForPath}/appointments`, title: 'Appointments', icon: 'calendar_today'},
        {path: `/patient/${userIdForPath}/treatments`, title: 'Treatments for patients', icon: 'assignment'},
        {path: `/patient/${userIdForPath}/exams`, title: 'Exams', icon: 'swap_vertical_circle'},
      ];
    } else if (this.userRole === 'Laboratory') {
      this.id = this.authenticationService.getId()
      userIdForPath = this.id;
      this.options = [
        {path: '/home', title: 'Home', icon: 'home'},
        {path: `/laboratory/${userIdForPath}/exams`, title: 'Exams', icon: 'swap_vertical_circle'},
      ];
    }
  }

  selectOption(path: string) {
    this.selectedOption = path;
  }

  logout() {
    this.authenticationService.signOut();
  }
}
