import { Component, OnInit, ViewChild } from '@angular/core';
import { TeachersService } from './teachers.service';
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

@Component({
  selector: 'app-all-teachers',
  templateUrl: './all-teachers.component.html',
  styleUrls: ['./all-teachers.component.scss'],
})
export class AllTeachersComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  displayedColumns: string[] = ['id', 'name', 'gender', 'mobile', 'address', 'mail', 'dob', 'qualification', 'designation', 'department', 'actions'];
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
      title: 'All Teachers',
      items: ['Teacher'],
      active: 'All Teacher',
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
  this.auth.get('/teachers').subscribe({
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
  this.router.navigate(['/admin/teachers/add-teacher']);
}

editCall(el: any) {
this.tService.setTeach(el);
this.router.navigate(['/admin/teachers/add-teacher']);
}

deleteItem(row: any) {
  this.tData = row;
  this.auth.delete(`/delete/teacher?id=${this.tData.id}`,).subscribe({
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
  this.router.navigate(['/admin/teachers/about-teacher']);
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
