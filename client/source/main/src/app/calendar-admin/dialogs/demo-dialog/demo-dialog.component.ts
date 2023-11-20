import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CalendarService } from '../../calendar.service';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from '@angular/forms';
import { Calendar } from '../../calendar.model';
import { AuthService } from '../../../core/service/auth.service';
import { formatDate } from '@angular/common';

export interface DialogData {
  id: number;
  action: string;
  calendar: Calendar;
}

@Component({
  selector: 'app-demo-dialog',
  templateUrl: './demo-dialog.component.html',
  styleUrls: ['./demo-dialog.component.scss']
})
export class DemoDialogComponent {
  action: string;
  dialogTitle: string;
  calendarForm: UntypedFormGroup;
  calendar: Calendar;
  showDeleteBtn = false;
  tch: any =[];
  role: any;
  constructor(
    public dialogRef: MatDialogRef<DemoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: DialogData,
    public calendarService: CalendarService,
    private fb: UntypedFormBuilder,
    public auth: AuthService
  ) {
    this.role = this.auth.currentUserValue.role;
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Demo Event';
      this.calendar = data.calendar;
      this.showDeleteBtn = true;
    } else {
      this.dialogTitle = 'New Demo Event';
      const blankObject = {} as Calendar;
      this.calendar = new Calendar(blankObject);
      this.showDeleteBtn = false;
    }

    this.calendarForm = this.createContactForm();
    this.getTeachers();
  }
  formControl = new UntypedFormControl('', [
    Validators.required,
    // Validators.email,
  ]);
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
  }
  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.calendar.id],
      teacher_id: [this.calendar.teacher_id, [Validators.required]],
      stdname: [this.calendar.stdname],
      startDate: [this.calendar.startDate, [Validators.required]],
      endDate: [null],
      eventdetails: [this.calendar.details],
      status: [this.calendar.status],
      assigned: [true, [Validators.required]],
      completed: [this.calendar.completed],
      approved: [this.calendar.approved]
    });
  }
  submit() {
    // emppty stuff
  }

  getTeachers() {
    this.auth.get('/teachers').subscribe({
      next: (value) => { 
        this.tch = value;
      },
      error: (err) => {
          // Handle errors
      },
  }) 
  }


  deleteEvent() {
    this.calendarService.deleteCalendar(this.calendarForm.getRawValue());
    this.dialogRef.close('delete');
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
  let obj = this.calendarForm.getRawValue();
 this.calendarService.addUpdateCalendar(obj);
   this.dialogRef.close('submit');
 // this.postEvent();
  }
}
