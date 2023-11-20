import { HttpClient } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@core/service/auth.service';
import { environment } from 'environments/environment';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TeachersService } from '../../admin/teachers/all-teachers/teachers.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { ComponentsModule } from '../../shared/components/components.module';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-admin-support',
  standalone: true,
  imports: [CommonModule,LoadingBarRouterModule,
    ComponentsModule,
    SharedModule],
    providers: [TeachersService],
  templateUrl: './admin-support.component.html',
  styleUrls: ['./admin-support.component.scss']
})
export class AdminSupportComponent {
  supportForm!: UntypedFormGroup;
  env = environment.apiUrl;
  totalItems!: number;
  items: any =[];
  btn: string = 'add';
  isTblLoading = true;
  user: any;
  breadscrums = [
    {
      title: 'Support',
      items: [],
      active: 'Support',
    },
  ];
  displayedColumns: string[] = ['raiseby_name', 'description', 'closure', 'done', 'role', 'date', 'actions'];
  dataSource = new MatTableDataSource();
  @ViewChild('formDialogTemplate') formDialogTemplate!: TemplateRef<any>;

  constructor(private fb: UntypedFormBuilder, private snackBar: MatSnackBar, private http: HttpClient, public router: Router,
    public tService: TeachersService, public auth: AuthService, private dialog: MatDialog,) {
    this.user = this.auth.currentUserValue;  
    this.tService.setTeach(null);
    this.dataSource.data = [];
    this.loadData();
  }

  refresh() {
    this.loadData();
  }

  loadData() {
    this.auth.get('/allsupport').subscribe({
      next: (result: any) => {
        this.isTblLoading = false;
        this.dataSource = new MatTableDataSource(result);
        this.totalItems = result && result.length;
        this.items = result;
      },
      error: (err) => {
        this.isTblLoading = false;
      }
    })
  }


  addNew() {
    this.btn = 'add';
    let currentUser = this.auth.currentUserValue;
    this.buildForm();
    this.supportForm.patchValue({'raiseby_name': `${currentUser.firstName} ${currentUser.lastName}`});
  }
  
  closeDialog() {
    this.dialog.closeAll();
  }

  buildForm() {
    let currentUser = this.auth.currentUserValue;
    this.tService.setTeach(null);
    this.supportForm = this.fb.group({
      description: ['', [Validators.required]],
      date: [{value: new Date(), disabled: true}, [Validators.required]],
      raiseby_id: ['', [Validators.required]],
      raiseby_name: ['', [Validators.required]],
      closure: [null, [Validators.required]],
      id:[''],
      done: [false, [Validators.required]]
    });

    this.dialog.open(this.formDialogTemplate, {
      width: 'auto',
      height: 'auto'
    });
  }

  editCall(el: any) {
    this.btn = 'edit';
    this.buildForm();
    this.supportForm.patchValue({'raiseby_name': el.raiseby_name, 'id': el.id, 'raiseby_id': el.raiseby_id, 'date': new Date(), 'closure': el.closure, 'done': el.done, 'description': el.description});
  }

  deleteItem(row: any) {
    this.auth.delete(`/delete/support?id=${row.id}`,).subscribe({
      next: (v) => {
        this.isTblLoading = false;
        this.showNotification(
          'black',
          'Deleted Record Successfully...!!!',
          'bottom',
          'center'
        );
        this.loadData();
      },
      error: (err) => {
        this.isTblLoading = false;
        this.showNotification(
          'snackbar-danger',
          'Failed to delete',
          'bottom',
          'center'
        );
      },
    })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  postSupport(): void {
    if (this.supportForm.valid) {
      // Handle form submission logic here
      let info = this.supportForm.getRawValue(); 
      info.date = new Date(info.date).toISOString();
      if(this.btn === 'edit') {
        this.putSupport(info);
      } else {
      this.auth.post('/add/support', info).subscribe({
        next: (value: any) => {
          if(value) {
          this.showNotification(
            'snackbar-success',
            'Raised support Successfully...!!!',
            'bottom',
            'center'
          );
          location.reload();
          }
        },
        error: (err: any) => {

        }
      }) 
      // Close the dialog
      this.closeDialog();
    }
  }
  }

  putSupport(data: any) {
    this.auth.put(`/edit/support?id=${data.id}`, data).subscribe({
      next: (value: any) => {
        if(value) {
        this.showNotification(
          'snackbar-success',
          'Updated support Successfully...!!!',
          'bottom',
          'center'
        );
        location.reload();
        }
      },
      error: (err: any) => {

      }
    }) 
    // Close the dialog
    this.closeDialog();
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
  
 async onSubmit() {
    if(this.auth.currentUserValue && this.auth.currentUserValue.id) {
      console.log('Form Value', this.supportForm.value);
    let data = this.supportForm.value;
    data.teacher_id = this.auth.currentUserValue.id;
    try {
      let response = false;
      await firstValueFrom(this.http.post<boolean>(`${this.env}/support`, data))
  .then((value) => {
    response = value;
    if(response) {
      this.showNotification(
        'snackbar-success',
        'Support ticket added Successfully...!!!',
        'bottom',
        'center'
      );
      location.reload();
    }
  })
    } catch (error) {
      this.showNotification(
        'snackbar-danger',
        'Failed to add event',
        'bottom',
        'center'
      );
    }
    }
  }
}