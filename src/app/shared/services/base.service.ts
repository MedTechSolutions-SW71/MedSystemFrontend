import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, retry, throwError} from "rxjs";
import {environment} from "../../../environments/environment";

export class BaseService<T> {

  profilePath: string = `${environment.profilesPath}`;
  userPath: string = `${environment.userPath}`;
  resourceEndpoint: string = '/resources';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/json',
    })
  }

  constructor(protected http: HttpClient) {

  }

  handleError(error: HttpErrorResponse) {
    // Default error handling
    if (error.error instanceof ErrorEvent) {
      console.log(`An error occurred ${error.error.message}`);
    } else {
      // Unsuccessful Response Error Code returned from Backend
      console.log(`Backend returned code ${error.status}, body was ${error.error}`);
    }
    return throwError(() => new Error('Something happened with request, please try again later'));
  }


  getUser(): Observable<T[]> {
    return this.http.get<T[]>(this.userResourcePath(), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }


  createProfile(item: any): Observable<T> {
    return this.http.post<T>(this.profileResourcePath(), JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }


  getProfiles(): Observable<T[]> {
    return this.http.get<T[]>(this.profileResourcePath(), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  updateProfile(id: any, item: any): Observable<T> {
    return this.http.put<T>(`${this.profileResourcePath()}/${id}`, JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  deleteProfiles(id: any) {
    return this.http.delete(`${this.profileResourcePath()}/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  private userResourcePath(): string {
    return `${this.userPath}${this.resourceEndpoint}`;
  }

  private profileResourcePath(): string {
    return `${this.profilePath}${this.resourceEndpoint}`;
  }

}








