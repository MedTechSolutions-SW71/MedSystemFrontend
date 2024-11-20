import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../../MedTechSolutions/security-service/service/authentication.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent implements OnInit {
  isSignedIn$!: Observable<boolean>;
  username: string = '';
  options: Array<{ path: string; title: string; icon?: string }> = [];

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isSignedIn$ = this.authenticationService.isSignedIn;

    this.isSignedIn$.subscribe((isSignedIn) => {
      if (isSignedIn) {
        this.username = this.authenticationService.getUsername() || '';
        this.updateOptions();
      }
    });
  }

  updateOptions(): void {
    const role = this.authenticationService.getRole();
    const userId = this.authenticationService.getId();

    if (role === 'Doctor') {
      this.options = [
        { path: '/home', title: 'Home', icon: 'home' },
        { path: `/doctor/${userId}/appointments`, title: 'Appointments', icon: 'calendar_today' },
        { path: `/doctor/${userId}/treatments`, title: 'Treatments', icon: 'assignment' },
        { path: `/doctor/${userId}/exams`, title: 'Exams', icon: 'science' },
      ];
    } else if (role === 'Patient') {
      this.options = [
        { path: '/home', title: 'Home', icon: 'home' },
        { path: `/patient/${userId}/appointments`, title: 'Appointments', icon: 'calendar_today' },
        { path: `/patient/${userId}/treatments`, title: 'Treatments', icon: 'assignment' },
        { path: `/patient/${userId}/exams`, title: 'Exams', icon: 'science' },
      ];
    } else if (role === 'Laboratory') {
      this.options = [
        { path: '/home', title: 'Home', icon: 'home' },
        { path: `/laboratory/${userId}/exams`, title: 'Exams', icon: 'science' },
      ];
    }
  }

  logout(): void {
    this.authenticationService.signOut();
  }
}
