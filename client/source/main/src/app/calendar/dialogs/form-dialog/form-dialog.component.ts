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

export interface DialogData {
  id: number;
  action: string;
  calendar: Calendar;
}

@Component({
  selector: 'app-form-dialog:not(i)',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  calendarForm: UntypedFormGroup;
  calendar: Calendar;
  tch: any= [];
  std: any =[];
  showDeleteBtn = false;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public calendarService: CalendarService,
    private fb: UntypedFormBuilder,
    public auth: AuthService,
  ) {
    // Set the defaults
    this.getStd();
    this.getTeachers();
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = data.calendar.title;
      this.calendar = data.calendar;
      this.showDeleteBtn = true;
    } else {
      this.dialogTitle = 'New Event';
      const blankObject = {} as Calendar;
      this.calendar = new Calendar(blankObject);
      this.showDeleteBtn = false;
    }

    this.calendarForm = this.createContactForm();
    const teacherIdControl = this.calendarForm.get('teacher_id');
    if (teacherIdControl) {
      teacherIdControl.setValue(this.auth.currentUserValue.id);
      teacherIdControl.disable();
      }
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
      title: [this.calendar.title, [Validators.required]],
      class: [this.calendar.class],
      startDate: [this.calendar.startDate, [Validators.required]],
      endDate: [this.calendar.endDate, [Validators.required]],
      details: [this.calendar.details],
      student_id: [this.calendar.student_id],
      teacher_id: [this.calendar.teacher_id],
      tch_mail: [this.calendar.tch_mail],
      status: [this.calendar.status],
      assigned: [true, [Validators.required]],
      completed: [this.calendar.completed],
      approved: [this.calendar.approved]
    });
  }

  getStd() {
    this.auth.get('//getstds').subscribe({
      next: (value) => { 
        this.std = value;
      },
      error: (err) => {
          // Handle errors
      },
  }) 
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
  submit() {
    // emppty stuff
  }
  deleteEvent() {
    this.calendarService.deleteCalendar(this.calendarForm.getRawValue());
    this.dialogRef.close('delete');
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    this.calendarService.addUpdateCalendar(this.calendarForm.getRawValue());
    this.dialogRef.close('submit');
  }
}
