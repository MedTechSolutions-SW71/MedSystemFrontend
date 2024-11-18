import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, retry, tap, throwError} from "rxjs";
import {environment} from "../../../environments/environment";
import {Treatment} from '../../MedTechSolutions/treatment-service/models/treatment';

export class BaseService<T> {
  profilePath: string = `${environment.profilesPath}`;
  userPath: string = `${environment.userPath}`;
  appointmentPath: string = `${environment.appointmentsPath}`;
  treatmentsPath: string = `${environment.treatmentsPath}`;
  examsPath: string = `${environment.examsPath}`;
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

  // Create Resource

  createProfile(item: any): Observable<T> {
    return this.http.post<T>(this.profileResourcePath(), JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  createAppointment(item: any): Observable<T> {
    return this.http.post<T>(this.appointmentResourcePath(), JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  createTreatment(item: any): Observable<T> {
    return this.http.post<T>(this.treatmentResourcePath(), JSON.stringify(item) ,this.httpOptions);
  }

  createExam(item: any): Observable<T> {
    return this.http.post<T>(this.examResourcePath(), JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Delete Resource

  deleteProfiles(id: any) {
    return this.http.delete(`${this.profileResourcePath()}/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  deleteAppointment(id: any) {
    return this.http.delete(`${this.appointmentResourcePath()}/${id}`, { responseType: 'text' }).pipe(
      tap(response => console.log('Respuesta de eliminación:', response)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error en la solicitud de eliminación:', error);
        return throwError(() => new Error('Something happened with request, please try again later'));
      })
    );
  }

  deleteTreatmentByName(treatmentName: string) {
    return this.http.delete(`${this.treatmentResourcePath()}/treatmentName/${treatmentName}`, { responseType: 'text' }).pipe(
      tap(response => console.log('Respuesta de eliminación:', response)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error en la solicitud de eliminación:', error);
        return throwError(() => new Error('Something happened with request, please try again later'));
      })
    );
  }


  // Update Resource

  updateAppointment(id: any, item: any): Observable<T> {
    return this.http.put<T>(`${this.appointmentResourcePath()}/${id}`, JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

   updateProfile(id: any, item: any): Observable<T> {
    return this.http.put<T>(`${this.profileResourcePath()}/${id}`, JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  updateExam(id: any, item: any): Observable<T> {
    return this.http.put<T>(`${this.examResourcePath()}/${id}/result`, JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  updateAppointmentDate(id: any, item: any): Observable<T> {
    return this.http.put<T>(`${this.appointmentResourcePath()}/${id}/date`, JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Get Resources

   getUser(): Observable<T[]> {
    return this.http.get<T[]>(this.userResourcePath(), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  getProfiles(): Observable<T[]> {
    return this.http.get<T[]>(this.profileResourcePath(), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  getProfileById(id: number): Observable<T> {
    return this.http.get<T>(`${this.profileResourcePath()}/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  getAppointments(): Observable<T[]> {
    return this.http.get<T[]>(this.appointmentResourcePath(), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  getByOtherId(id: number, idType: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.appointmentResourcePath()}/${idType}/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  getBySpecialty(speciality: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.profileResourcePath()}/speciality/${speciality}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  getTreatments() {
    return this.http.get<T[]>(this.treatmentResourcePath());
  }

  getTreatmentsByPatientId(patientId: string | null): Observable<T[]> {
    return this.http.get<T[]>(`${this.treatmentResourcePath()}/patientId/${patientId}`);
  }

  getTreatmentsByDoctorId(doctorId: string | null): Observable<T[]> {
    return this.http.get<T[]>(`${this.treatmentResourcePath()}/doctorId/${doctorId}`);
  }

  getExamByDoctorId(id: number, idType: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.examResourcePath()}/${idType}/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  getExamByPatientId(id: number, idType: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.examResourcePath()}/${idType}/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  getExams(): Observable<T[]> {
    return this.http.get<T[]>(this.examResourcePath(), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  private userResourcePath(): string {
    return `${this.userPath}${this.resourceEndpoint}`;
  }

  private profileResourcePath(): string {
    return `${this.profilePath}${this.resourceEndpoint}`;
  }

   private appointmentResourcePath(): string {
    return `${this.appointmentPath}${this.resourceEndpoint}`;
  }

  private treatmentResourcePath(): string {
    return  `${this.treatmentsPath}${this.resourceEndpoint}`;
  }

  private examResourcePath(): string {
    return `${this.examsPath}${this.resourceEndpoint}`;
  }

}








