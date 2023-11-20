import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { environment } from 'environments/environment';
import { MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition, MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public _requestInProgressSubject = new BehaviorSubject<boolean>(false);
  public requestInProgress$ = this._requestInProgressSubject.asObservable();
  private baseUrl: string = environment.apiUrl;


  constructor(private http: HttpClient,  private snackBar: MatSnackBar) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  setRequestInProgress(value: boolean) {
    this._requestInProgressSubject.next(value);
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string, mode: string) {
    let url = '';
    if(mode == 'teacher') {
      url = `${environment.apiUrl}/loginteacher`;
    }
    else if(mode == 'admin') {
      url = `${environment.apiUrl}/loginadmin`;
    } else if(mode == 'student') {
      url = `${environment.apiUrl}/loginstudent`;
    }
    return this.http
      .post<User>(url, {
        username,
        password,
      })
      .pipe(
        map((user) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(this.currentUserValue);
    return of({ success: false });
  }


  post(endpoint: string, data: any): Observable<any> {
    const url = this.baseUrl + endpoint;
    return this.http.post(url, data, this.getHeaders());
  }

  get(endpoint: string): Observable<any> {
    const url = this.baseUrl + endpoint;
    return this.http.get(url, this.getHeaders());
  }

  put(endpoint: string, data: any): Observable<any> {
    const url = this.baseUrl + endpoint;
    return this.http.put(url, data, this.getHeaders());
  }

  delete(endpoint: string): Observable<any> {
    const url = this.baseUrl + endpoint;
    return this.http.delete(url, this.getHeaders());
  }

  private getHeaders(): any {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return { headers };
  }

  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
}
