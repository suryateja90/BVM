import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { environment } from 'environments/environment';
@Injectable()
export class StudentsDisplayService extends UnsubscribeOnDestroyAdapter {
  //private readonly API_URL = 'assets/data/lectures.json';
  private readonly API_URL = environment.apiUrl;
  isTblLoading = true;
  dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: any;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): any[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllStudents(): void {
    this.subs.sink = this.httpClient.get(`${this.API_URL}/getstds`).subscribe({
      next: (data: any) => {
        this.isTblLoading = false;
        this.dataChange.next(data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
      },
    });
  }
  addLectures(lectures: any): void {
    this.dialogData = lectures;

    // this.httpClient.post(this.API_URL, lectures)
    //   .subscribe({
    //     next: (data) => {
    //       this.dialogData = lectures;
    //     },
    //     error: (error: HttpErrorResponse) => {
    //        // error code here
    //     },
    //   });
  }
  updateLectures(lectures: any): void {
    this.dialogData = lectures;

    // this.httpClient.put(this.API_URL + lectures.id, lectures)
    //     .subscribe({
    //       next: (data) => {
    //         this.dialogData = lectures;
    //       },
    //       error: (error: HttpErrorResponse) => {
    //          // error code here
    //       },
    //     });
  }
  deleteLectures(id: number): void {
    console.log(id);

    // this.httpClient.delete(this.API_URL + id)
    //     .subscribe({
    //       next: (data) => {
    //         console.log(id);
    //       },
    //       error: (error: HttpErrorResponse) => {
    //          // error code here
    //       },
    //     });
  }
}
