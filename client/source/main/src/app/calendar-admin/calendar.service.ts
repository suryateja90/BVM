import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Calendar } from './calendar.model';
import { Observable } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Injectable()
export class CalendarService {
  private readonly API_URL = 'assets/data/calendar.json';
  private readonly calenderApi = `${environment.apiUrl}/getcalenderevents`;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  dataChange: BehaviorSubject<Calendar[]> = new BehaviorSubject<Calendar[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: Calendar;
  constructor(private httpClient: HttpClient) {}
  get data(): Calendar[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  getAllCalendars(teacherId: Number): Observable<any> {
    return this.httpClient
      .get(`${this.calenderApi}?id=${teacherId}`)
      .pipe(catchError(this.errorHandler));
  }

  postCalenderEvent(data: any) {
    return this.httpClient
    .post(`${environment.apiUrl}/addevent`, data)
    .pipe(catchError(this.errorHandler));
  }

  editCalenderEvent(data: any) {
    return this.httpClient
    .put(`${environment.apiUrl}/editevent`, data)
    .pipe(catchError(this.errorHandler));
  }
 
  deleteCalenderEvent(id: any) {
    return this.httpClient
    .delete(`${environment.apiUrl}/deleteevent?id=${id}`)
    .pipe(catchError(this.errorHandler));
  }

  addUpdateCalendar(calendar: Calendar): void {
    this.dialogData = calendar;
  }
  deleteCalendar(calendar: Calendar): void {
    this.dialogData = calendar;
  }
  errorHandler(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
