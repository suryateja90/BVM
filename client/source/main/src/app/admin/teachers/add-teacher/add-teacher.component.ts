import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

import {AuthService} from '../../../core/service/auth.service';
import { MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { TeachersService } from '../all-teachers/teachers.service';


@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.component.html',
  styleUrls: ['./add-teacher.component.scss'],
})

export class AddTeacherComponent {
  proForm: UntypedFormGroup;
  breadscrums = [
    {
      title: 'Add Teacher',
      items: ['Teacher'],
      active: 'Add Teacher',
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
      designation: ['', [Validators.required]],
      department: [''],
      address: ['', [Validators.required]],
      mail: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      dob: ['', [Validators.required]],
      qualification: ['', [Validators.required]],
    });
    this.checkEditAdd();
  }
  checkEditAdd() {
    if(this.tService.getTeach()) {
      this.edit = true;
      let editTeacher:any = this.tService.getTeach();
      this.proForm.patchValue({
        firstName: editTeacher.firstName,
        id: editTeacher.id,
        lastName: editTeacher.lastName,
        gender: editTeacher.gender,
        mobile: editTeacher.mobile,
        password: editTeacher.password, // Assuming you don't want to display the password
        confirmPassword: '', // Assuming you don't want to display the confirmPassword
        designation: editTeacher.designation,
        department: editTeacher.department,
        address: editTeacher.address,
        mail: editTeacher.mail,
        dob: editTeacher.dob,
        qualification: editTeacher.qualification,
      });
    }
  }


  onSubmit() {
    if(!this.edit){
    let body = this.proForm.getRawValue();
    body.dob = new Date(body.dob).toISOString();
    this.auth.post('/add/teacher', body).subscribe({
      next: (value: boolean) => {
        if(value) {
          this.showNotification(
            'snackbar-success',
            'Added teacher Successfully...!!!',
            'bottom',
            'center'
          );
          history.back();
        }
        else {
          this.showNotification(
            'snackbar-warn',
            'Failed adding teacher',
            'bottom',
            'center'
          );
        }
      },
      error: (err: any) => {
        this.showNotification(
          'snackbar-warn',
          'Failed adding teacher',
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
    this.auth.put('/edit/teacher', body).subscribe({
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
          'Failed updating teacher',
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


export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  };
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