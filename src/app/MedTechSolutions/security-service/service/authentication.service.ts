import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {Router} from "@angular/router";
import {SignUpRequest} from "../model/sign-up.request";
import {SignUpResponse} from "../model/sign-up.response";
import {SignInRequest} from "../model/sign-in.request";
import {SignInResponse} from "../model/sign-in.response";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  basePath: string = `${environment.userPath}`;
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  private signedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private signedInUserId: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private signedInUsername: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private router: Router, private http: HttpClient) { }

  get isSignedIn(): Observable<boolean> {
    return this.signedIn.asObservable();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  get currentUserId() { return this.signedInUserId.asObservable(); }

  get currentUsername() { return this.signedInUsername.asObservable(); }

  signUp(signUpRequest: SignUpRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.post<SignUpResponse>(`${this.basePath}/api/v1/auth/sign-up`, signUpRequest, this.httpOptions)
        .subscribe({
          next: (response) => {
            this.signedInUserId.next(response.id);
            console.log(`Signed Up as ${response.email} with ID: ${response.id} and role ${response.role}`);
            this.router.navigate(['/sign-in']).then(() => resolve());
          },
          error: (error) => {
            console.error(`Error while signing up: ${error.message}`);
            this.router.navigate(['/sign-up']).then(() => reject(error));
          }
        });
    });
  }

  signIn(signInRequest: SignInRequest) {
    return this.http.post<SignInResponse>(`${this.basePath}/api/v1/auth/sign-in`, signInRequest, this.httpOptions)

  }

  signOut() {
    this.signedIn.next(false);
    this.signedInUserId.next(0);
    this.signedInUsername.next('');
    localStorage.removeItem('token');
    this.router.navigate(['/sign-in']).then();
  }

  verification(token: string, email: string, role: string) {
    localStorage.setItem('email', email);
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);

    this.signedIn.next(true);

    this.router.navigate(['/home']);
  }
}
