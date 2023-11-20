import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import {
  TableExportUtil,
  TableElement,
  UnsubscribeOnDestroyAdapter,
} from '@shared';
import { MatInput } from '@angular/material/input';
import { AuthService } from '../../../core/service/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TeachersService } from '../../teachers/all-teachers/teachers.service';

@Component({
  selector: 'app-all-students',
  templateUrl: './all-students.component.html',
  styleUrls: ['./all-students.component.scss'],
})
export class AllStudentsComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  displayedColumns: string[] = ['id', 'mobile', 'grade', 'dob', 'course', 'note', 'address', 'gender','actions'];
  dataSource = new MatTableDataSource();
  pageSize = 10;
  pageIndex = 0;
  totalItems!: number;
  items: any;
  isTblLoading = true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('filter') filter!: MatInput;
  pageSizeOptions: number[] = [5, 10, 25, 100]; 
  breadscrums = [
    {
      title: 'All Students',
      items: ['Students'],
      active: 'All Students',
    },
  ];
  tData: any;
  
  constructor(public auth: AuthService, public router: Router, private snackBar: MatSnackBar,
    public tService: TeachersService) {
    super();
    this.dataSource.data = [];
  }

  ngOnInit(): void {
    this.tService.setTeach(null);
  this.loadData();
}

refresh() {
  this.loadData();
}

loadData() {
  this.auth.get('/getstds').subscribe({
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
  this.tService.setTeach(null);  
  this.router.navigate(['/admin/students/add-student']);
}

editCall(el: any) {
this.tService.setTeach(el);
this.router.navigate(['/admin/students/add-student']);
}

deleteItem(row: any) {
  this.tData = row;
  this.auth.delete(`/delete/student?id=${this.tData.id}`,).subscribe({
    next: (v) => {
      this.showNotification(
        'black',
        'Deleted Record Successfully...!!!',
        'bottom',
        'center'
      );
      location.reload();
    },
    error: (err) => {
      this.showNotification(
        'snackbar-danger',
        'Failed to delete',
        'bottom',
        'center'
      );
    },
  })
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

viewCall(el: any) {
  this.tService.setTeach(el);
  this.router.navigate(['/admin/students/about-student']);
}

onPageChanged(event: any) {
  this.pageIndex = event.pageIndex;
  this.pageSize = event.pageSize;
} 

applyFilter(filterValue: string) {
  this.dataSource.filter = filterValue.trim().toLowerCase();
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}
}
