import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

import {AuthService} from '../../../core/service/auth.service';
import { MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { TeachersService } from '../../teachers/all-teachers/teachers.service';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss'],
})
export class AddStudentComponent {
  proForm: UntypedFormGroup;
  gradesInfo: any =[];
  breadscrums = [
    {
      title: 'Add Student',
      items: ['Student'],
      active: 'Add Student',
    },
  ];
  edit: boolean = false;
  constructor(private fb: UntypedFormBuilder, public auth: AuthService,
    public tService: TeachersService, private snackBar: MatSnackBar) {
    this.proForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      lastName: [''],
      id: [''],
      gender: ['', [Validators.required]],
      mobile: ['', [Validators.required, mobileNumberValidator()]],
      password: ['', [Validators.required]],
      course: [''],
      address: ['', [Validators.required]],
      num_classes: ['', [Validators.required]],
      mail: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      dob: ['', [Validators.required]],
      grade: ['', [Validators.required]],
    });
    this.grades();

  }

  grades()
  {
    let grades =  this.auth.get('/grades').subscribe((v) => {
      this.checkEditAdd();
      this.gradesInfo = v;
    });
  }


  checkEditAdd() {
    if(this.tService.getTeach()) {
      this.edit = true;
      let editTeacher:any = this.tService.getTeach();
      this.proForm.patchValue({
        firstName: editTeacher.firstName,
        id: editTeacher.id,
        name: editTeacher.name,
        lastName: editTeacher.lastName,
        gender: editTeacher.gender,
        mobile: editTeacher.mobile,
        password: editTeacher.password,
        department: editTeacher.department,
        address: editTeacher.address,
        num_classes: editTeacher.num_classes,
        mail: editTeacher.mail,
        dob: editTeacher.dob,
        course: editTeacher.course,
        grade: editTeacher.grade
      });
    }
  }


  onSubmit() {
    if(!this.edit){
    let body = this.proForm.getRawValue();
    body.dob = new Date(body.dob).toISOString();
    this.auth.post('/add/student', body).subscribe({
      next: (value: boolean) => {
        if(value) {
          this.showNotification(
            'snackbar-success',
            'Added student Successfully...!!!',
            'bottom',
            'center'
          );
          history.back();
        }
        else {
          this.showNotification(
            'snackbar-warn',
            'Failed adding student',
            'bottom',
            'center'
          );
        }
      },
      error: (err: any) => {
        this.showNotification(
          'snackbar-warn',
          'Failed adding student',
          'bottom',
          'center'
        );
      }
    })
  } else {
    this.doEdit();
  }
  }

  doEdit() {
    let body = this.proForm.getRawValue();
    this.auth.put('/edit/student', body).subscribe({
      next: (value: boolean) => {
        if(value) {
          this.showNotification(
            'snackbar-success',
            'Updated Successfully...!!!',
            'bottom',
            'center'
          );
          history.back();
        }
      },
      error: (err: any) => {
        this.showNotification(
          'snackbar-warn',
          'Failed updating student',
          'bottom',
          'center'
        );
      }
    });
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

  cancel() {
    history.back();
  }
}

export function mobileNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const mobileNumber = control.value;

    // Regular expression to validate mobile number format
    const mobileRegex = /^[0-9]{10}$/;

    if (!mobileRegex.test(mobileNumber)) {
      return { invalidMobileNumber: true };
    }

    return null;
  };
}
