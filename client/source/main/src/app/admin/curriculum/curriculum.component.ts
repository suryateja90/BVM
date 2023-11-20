import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { AuthService } from '../../core/service/auth.service';
import { ComponentsModule } from '../../shared/components/components.module';
import { SharedModule } from '../../shared/shared.module';
import { TeachersService } from '../teachers/all-teachers/teachers.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-curriculum',
  standalone: true,
  imports: [CommonModule,
    LoadingBarRouterModule,
    ComponentsModule,
    SharedModule],
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.scss']
})
export class CurriculumComponent {
  gradesInfo: any =[];
  gradeValue: any;
  proForm!: UntypedFormGroup;
  curriculum!:UntypedFormArray;
  gradeSelected: boolean = false;
  mode;
  private route = inject(ActivatedRoute);

  constructor(private fb: UntypedFormBuilder, public auth: AuthService, private snackBar: MatSnackBar) {
    this.gradeValue = Number(this.route.snapshot.paramMap.get('id'));
    this.mode = this.route.snapshot.paramMap.get('mode');
    if(this.gradeValue && this.mode == 'edit') {
      this.loadC();
    }
      this.grades();
      this.buildForm();
}

loadC() {
  this.auth.get('/allcurriculum').pipe(
    map((x: any) => {
      //@ts-ignore
     return x.filter(el => el.grade_id === Number(this.gradeValue));
    })
  ).subscribe((v: any) => {
    if (v !== undefined) {
      // Process the value v
      this.buildForm();
      this.patchEdit(v);
    }
  });
}

patchEdit(v: any) {
const curriculumFormArray = this.proForm.get('curriculum') as FormArray;
const data = v;
// Loop through the data and add a form group for each item
//@ts-ignore
data.forEach(item => {
  const curriculumFormGroup = this.fb.group({
    id: [item.id],
    grade_id: [item.grade_id],
    sno: [item.sno],
    lesson_name: [item.lesson_name],
    description: [item.description],
    link: [item.link]
  });
  curriculumFormArray.push(curriculumFormGroup);
})
 

}



// When a grade is selected, set gradeSelected to true
onGradeSelected() {
  this.gradeSelected = true;
}

grades()
{
  let grades =  this.auth.get('/grades').subscribe((v) => {
    this.gradesInfo = v;
  });
}

getControls() {
  return (this.proForm.get('curriculum') as FormArray).controls;
}

// @ts-nocheck
buildForm() {
  this.proForm = this.fb.group({
    curriculum: this.fb.array([]) //@ts-ignore
  });
}

createItem(){
  return this.fb.group({
    link:["",Validators.required],
    lesson_name:["",Validators.required],
    description: ["", Validators.required],
    sno: ["", Validators.required],
    grade_id: [this.gradeValue],
    id:[]
  });
}

removeRow(index: number) {
  let val = this.proForm.getRawValue().curriculum;
  if(val[index].id) {
    this.deleteCall(val[index]);
  }else {
    (<FormArray>this.proForm.get('curriculum')).removeAt(index);
  }
  
}

deleteCall(val: any) {
  this.auth.delete(`/delete/curriculum?id=${val.id}`,).subscribe({
    next: (v) => {
      this.auth.showNotification(
        'black',
        'Deleted Record Successfully...!!!',
        'bottom',
        'center'
      );
      location.reload();
    },
    error: (err) => {
      this.auth.showNotification(
        'snackbar-danger',
        'Failed to delete',
        'bottom',
        'center'
      );
    },
  })
}

addItem():void{
  //@ts-ignore
  this.curriculum = this.proForm.get('curriculum') as FormArray;
  //@ts-ignore
  this.curriculum.push(this.createItem());
}

submit() {
  if(this.mode === 'edit') {
    this.doUpdate();
  }else {

  let body = this.proForm.getRawValue().curriculum;
  body.forEach((v: any)=> {
    v.sno = Number(v.sno)
    })
  this.auth.post('/add/curriculum', body).subscribe({
    next: (value: boolean) => {
      if(value) {
        this.auth.showNotification(
          'snackbar-success',
          'Added curriculum Successfully...!!!',
          'bottom',
          'center'
        );
        history.back();
      }
      else {
        this.auth.showNotification(
          'snackbar-warn',
          'Failed adding curriculum',
          'bottom',
          'center'
        );
      }
    },
    error: (err: any) => {
      this.auth.showNotification(
        'snackbar-warn',
        'Failed adding curriculum',
        'bottom',
        'center'
      );
    }
  })
  }
}

doUpdate() {
  let body = this.proForm.getRawValue().curriculum;
  body.forEach((v: any)=> {
    v.sno = Number(v.sno)
    })
  this.auth.put('/edit/curriculum', body).subscribe({
    next: (value: boolean) => {
      if(value) {
        this.auth.showNotification(
          'snackbar-success',
          'Added curriculum Successfully...!!!',
          'bottom',
          'center'
        );
        history.back();
      }
      else {
        this.auth.showNotification(
          'snackbar-warn',
          'Failed adding curriculum',
          'bottom',
          'center'
        );
      }
    },
    error: (err: any) => {
      this.auth.showNotification(
        'snackbar-warn',
        'Failed adding curriculum',
        'bottom',
        'center'
      );
    }
  })
}

goBack() {
  history.back();
}

}
