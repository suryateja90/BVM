import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormComponent } from 'app/contacts/form/form.component';
import { StudentsDisplayService } from './studentDisplayService';
import { HttpClient } from '@angular/common/http';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, map, merge } from 'rxjs';
import { Contacts } from 'app/contacts/contacts.model';
import { UnsubscribeOnDestroyAdapter } from '@shared';

@Component({
  selector: 'app-student-display',
  templateUrl: './student-display.component.html',
  styleUrls: ['./student-display.component.scss']
})
export class StudentDisplayComponent extends UnsubscribeOnDestroyAdapter
implements OnInit{
  dataSource!: ExampleDataSource;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  breadscrums = [
    {
      title: 'Students',
      items: [],
      active: 'Students',
    },
  ];
  displayedColumns: string[] = ['id', 'img', 'name', 'mobile', 'grade', 'course', 'note'];
  exampleDatabase?: StudentsDisplayService;

  constructor( public dialog: MatDialog, private snackBar: MatSnackBar,
    public stdService: StudentsDisplayService, public httpClient: HttpClient) {
      super();
  }

  ngOnInit() {
    this.loadData();
  }
  refresh() {
    this.loadData();
  }
  detailsCall(row: any) {
    this.dialog.open(FormComponent, {
      data: {
        contacts: row,
        action: 'details',
      },
      height: '75%',
      width: '35%',
    });
  }

  public loadData() {
    this.exampleDatabase = new StudentsDisplayService(this.httpClient);
    this.dataSource = new ExampleDataSource(
      this.exampleDatabase,
      this.paginator,
      this.sort
    );
    // this.subs.sink = fromEvent(this.filter?.nativeElement, 'keyup').subscribe(
    //   () => {
    //     if (!this.dataSource) {
    //       return;
    //     }
    //     this.dataSource.filter = this.filter?.nativeElement.value;
    //   }
    // );
  }

  // setData() {
  //   this.dataSource = [
  //     {
  //       id: 1,
  //       img: 'https://example.com/image1.jpg',
  //       name: 'John Doe',
  //       mobile: '1234567890',
  //       grade: 'john@example.com',
  //       course: '123 Main Street, City, Country',
  //       note: 'Lorem ipsum dolor sit amet.'
  //     },
  //     {
  //       id: 2,
  //       img: 'https://example.com/image2.jpg',
  //       name: 'Jane Doe',
  //       mobile: '9876543210',
  //       grade: 'jane@example.com',
  //       course: '456 Elm Street, Town, Country',
  //       note: 'Consectetur adipiscing elit.'
  //     },
  //     // Add more objects as needed
  //   ];
    
  // }
}
export class ExampleDataSource extends DataSource<any> {
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: any = [];
  renderedData:any = [];
  constructor(
    public exampleDatabase: StudentsDisplayService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.exampleDatabase.getAllStudents();
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((contacts: any) => {
            const searchStr = (
              (contacts.name || '') +
              (contacts.grade || '') +
              (contacts.mobile || '') +
              (contacts.course || '')
            ).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
          });
        // Sort filtered data
        const sortedData = this.sortData(this.filteredData.slice());
        // Grab the page's slice of the filtered sorted data.
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        this.renderedData = sortedData.splice(
          startIndex,
          this.paginator.pageSize
        );
        return this.renderedData;
      })
    );
  }
  disconnect() {
    //disconnect
  }
  /** Returns a sorted copy of the database data. */
  sortData(data: any[]): Contacts[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      switch (this._sort.active) {
        case 'id':
          [propertyA, propertyB] = [a.id, b.id];
          break;
        case 'name':
          [propertyA, propertyB] = [a.name, b.name];
          break;
        case 'grade':
          [propertyA, propertyB] = [a.grade, b.grade];
          break;
        case 'course':
          [propertyA, propertyB] = [a.course, b.course];
          break;
      }
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      return (
        (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
      );
    });
  }
}