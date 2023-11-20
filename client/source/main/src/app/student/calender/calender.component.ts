import { Direction } from '@angular/cdk/bidi';
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';
import { EventInput, CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import { forkJoin } from 'rxjs';
import { DemoDialogComponent } from '../../calendar/dialogs/demo-dialog/demo-dialog.component';
import { FormDialogComponent } from '../../calendar/dialogs/form-dialog/form-dialog.component';
import { AuthService } from '../../core/service/auth.service';
import { UnsubscribeOnDestroyAdapter } from '../../shared/UnsubscribeOnDestroyAdapter';
import { Calendar } from '../../calendar-admin/calendar.model';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';


@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss']
})
export class CalenderComponent extends UnsubscribeOnDestroyAdapter
implements OnInit {
  @ViewChild('calendar', { static: false })
  calendar: Calendar | null;
  dialogTitle: string;
  @ViewChild('formDialogTemplate') formDialogTemplate!: TemplateRef<any>;
  mode = '';
  tch: any =[];
  filterOptions = 'All';
  info: any;
  calendarData!: Calendar;
  filterItems: string[] = [
    'work',
    'personal',
    'important',
    'travel',
    'friends',
  ];

  calendarEvents?: EventInput[];
  tempEvents?: EventInput[];

  // public filters = [
  //   { name: 'work', value: 'Work', checked: true },
  //   { name: 'personal', value: 'Personal', checked: true },
  //   { name: 'important', value: 'Important', checked: true },
  //   { name: 'travel', value: 'Travel', checked: true },
  //   { name: 'friends', value: 'Friends', checked: true },
  // ];

  public filters: any = [];

  breadscrums = [
    {
      title: 'Calendar',
      items: [],
      active: 'Calendar',
    },
  ];

  constructor(
    private fb: UntypedFormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public cdr: ChangeDetectorRef,
    public auth: AuthService
  ) {
    super();
    this.setMode();
    this.dialogTitle = 'Add New Event';
    const blankObject = {} as Calendar;
    this.calendar = new Calendar(blankObject);
  }

  public ngOnInit(): void {
    this.loadAll();
    this.getTeachers();

  }


  loadAll() {
    const getMyEvents$ = this.auth.get(`/getStudentEvents?id=${this.auth.currentUserValue.id}`).subscribe({
      next: (myEventsResponse) => {
        // Handle the responses here
        const myEvents = myEventsResponse;
        console.log(myEvents);
        this.loadCalender(myEvents);
      },
      error: error => {
        // Handle any errors
        console.error('Error:', error);
      }
    })
  }



  loadCalender(val:any) {
      if(val && val.length) {
        this.filters = [];
        this.filterItems = [];
      const formattedEvents: EventInput[] = val.map((event: any) => {
        const start = new Date(event.start_date);
        const end = new Date(event.end_date);
        this.filters.push({
          "name": event.status,
          "value": event.status,
          checked: true
        });
        this.filterItems.push(event.status)
      
        return {
          id: event.id,
          title: event.title,
          start, // This is a Date object
          end,   // This is a Date object
          className: 'fc-event-info',
          groupId: event.class,
          details: event.eventdetails,
          class: event.class,
          student_id: event.student_id,
          tch_mail: event.tch_mail,
          teacher_id: event.teacher_id,
          status: event.status,
          approved: event.approved,
          assigned: event.assigned,
          completed: event.completed,
          demo: false
        };
      });
      this.calendarEvents = formattedEvents;
      this.tempEvents = JSON.parse(JSON.stringify(this.calendarEvents));
      this.calendarOptions.initialEvents = this.calendarEvents;
      this.filters = this.removeDuplicateObjects(this.filters);
      this.filterItems = [...new Set(this.filterItems)];
      this.cdr.detectChanges();  
      }


    
  }

  areObjectsEqual(obj1 : any, obj2: any) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

removeDuplicateObjects(arr: any) {
    return arr.filter((item: any, index: any, self: any) => 
        index === self.findIndex((obj:any) =>  { return this.areObjectsEqual(obj, item)})
    );
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


setMode() {
  if(this.auth.currentUserValue.role === 'Admin') {
    this.mode = 'Admin'
  } else if(this.auth.currentUserValue.role === 'Teacher') {
    this.mode = 'Teacher'
  } else if(this.auth.currentUserValue.role === 'Student') {
    this.mode = 'Student'
  }
}

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleDateSelect(selectInfo: DateSelectArg) {
  }


  changeCategory(event: MatCheckboxChange, filter: { name: string }) {
    if (event.checked) {
      this.filterItems.push(filter.name);
    } else {
      this.filterItems.splice(this.filterItems.indexOf(filter.name), 1);
    }
    this.filterEvent(this.filterItems);
  }

  filterEvent(element: string[]) {
    const list = this.tempEvents?.filter((x) =>
      element.map((y?: string) => y).includes(x.groupId)
    );

    this.calendarOptions.events = list;
    this.calendarEvents = list;
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.eventClick(clickInfo);
  }

  eventClick(row: EventClickArg) {
    let calendarData: any;
      const tName= this.tch.find((e:any) => e.id === row.event.extendedProps['teacher_id'] );
      const obj:any = row.event.extendedProps;
      calendarData = {
        id: row.event.id,
        title: row.event.title,
        class: row.event.groupId,
        startDate: row.event.start,
        endDate: row.event.end || row.event.start,
        details: row.event.extendedProps['details'],
        teacher_id: row.event.extendedProps['teacher_id'],
        student_id: row.event.extendedProps['student_id'],
        tch_mail: row.event.extendedProps['tch_mail'],
        assigned: obj.assigned,
        completed: obj.completed,
        approved: obj.approved,
        status: obj.status,
        tName: (tName.firstName+''+tName.lastName)
      };
      this.info = calendarData;

    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    this.dialog.open(this.formDialogTemplate, {
        direction: tempDirection
      });
    } 
  

  refresh() {
    location.reload();
  }


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleEvents(events: EventApi[]) {
    // this.currentEvents = events;
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

  getClassNameValue(category: string) {
    let className;

    if (category === 'work') className = 'fc-event-success';
    else if (category === 'personal') className = 'fc-event-warning';
    else if (category === 'important') className = 'fc-event-primary';
    else if (category === 'travel') className = 'fc-event-danger';
    else if (category === 'friends') className = 'fc-event-info';

    return className;
  }
}
