import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from '@fullcalendar/core';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { MatDialog } from '@angular/material/dialog';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Calendar } from './calendar.model';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { CalendarService } from './calendar.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { INITIAL_EVENTS } from './events-util';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { UnsubscribeOnDestroyAdapter } from '../shared/UnsubscribeOnDestroyAdapter';
import { Direction } from '@angular/cdk/bidi';
import { DatePipe, formatDate } from '@angular/common';
import { AuthService } from '../core/service/auth.service';
import { forkJoin } from 'rxjs';
import { DemoDialogComponent } from './dialogs/demo-dialog/demo-dialog.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  @ViewChild('calendar', { static: false })
  calendar: Calendar | null;
  public addCusForm: UntypedFormGroup;
  dialogTitle: string;
  mode = '';
  filterOptions = 'All';
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
    public calendarService: CalendarService,
    private snackBar: MatSnackBar,
    public cdr: ChangeDetectorRef,
    public auth: AuthService
  ) {
    super();
    this.setMode();
    this.dialogTitle = 'Add New Event';
    const blankObject = {} as Calendar;
    this.calendar = new Calendar(blankObject);
    this.addCusForm = this.createCalendarForm(this.calendar);
  }

  public ngOnInit(): void {
    //this.calendarEvents = INITIAL_EVENTS;
    // if(this.mode == 'Teacher'){
    //   this.loadCalender();
    // } else if(this.mode == 'Admin') {
    //   this.loadAdminCalender();
    // }

    this.loadAll();

  }


  loadAll() {
    const getMyEvents$ = this.calendarService.getAllCalendars(this.auth.currentUserValue.id);
    const getDemoEvent$ = this.auth.get(`/get/demoevent?id=${this.auth.currentUserValue.id}`);
    forkJoin([getMyEvents$, getDemoEvent$]).subscribe({
      next: ([myEventsResponse, demoEventResponse]) => {
        // Handle the responses here
        const myEvents = myEventsResponse;
        const demoEvents = demoEventResponse?.filter((e:any) => (e.teacher_id === this.auth.currentUserValue.id && e.status == 'assigned'));
        this.loadCalender(myEvents,demoEvents);
      },
      error: error => {
        // Handle any errors
        console.error('Error:', error);
      }
    })
  }



  loadCalender(val:any,demoEvents:any) {
      if(val && val.length) {
        this.filters = [];
        this.filterItems = [];
      const formattedEvents: EventInput[] = val.map((event: any) => {
        const start = new Date(event.start_date);
        const end = new Date(event.end_date);
        this.filters.push({
          "name": event.class,
          "value": event.class,
          checked: true
        });
        this.filterItems.push(event.class)
      
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

      if(demoEvents && demoEvents.length) {
        this.loadAdminCalender(demoEvents, this.filterItems,this.filters);
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

// @ts-ignore
loadAdminCalender(val:any, filterItems:any,filters:any) {
      this.filterItems = filterItems;
      this.filters = filters;
      const formattedEvents: EventInput[] = val.map((event: any) => {
        const start = new Date(event.startDate);
        const end = event.endData ? new Date(event.endDate) : null;
        this.filters.push({
          "name": event.status,
          "value": event.status,
          checked: true
        });
        this.filterItems.push(event.class)
      
        return {
          id: event.id,
          teacher_id: event.teacher_id,
          stdname: event.stdname,
          start, // This is a Date object
          end,   // This is a Date object
          className: 'fc-event-primary',
          details: event.eventdetails,
          assigned: event.assigned,
          completed: event.completed,
          approved: event.approved,
          status: event.status
        };
      });
      if (this.calendarEvents && this.calendarEvents.length){
        this.calendarEvents = [...this.calendarEvents,...formattedEvents];
      } else {
        this.calendarEvents = formattedEvents;
      }
      this.tempEvents = JSON.parse(JSON.stringify(this.calendarEvents));
      this.calendarOptions.initialEvents = this.calendarEvents;
      this.filters = this.removeDuplicateObjects(this.filters);
      this.filterItems = [...new Set(this.filterItems)];
      this.cdr.detectChanges();  
  
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
    this.addNewEvent();
  }

  addNewEvent() {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        calendar: this.calendar,
        action: 'add',
      },
      direction: tempDirection,
    });

    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 'submit') {
        this.calendarData = this.calendarService.getDialogData();
        const datePipe = new DatePipe('en-US');
        // const formattedStartDate = datePipe.transform(this.calendarData.startDate, 'yyyy-MM-dd');
        // const formattedEndDate = datePipe.transform(this.calendarData.endDate, 'yyyy-MM-dd');
        const obj =
          {
            "title": this.calendarData.title,
            "class": this.calendarData?.class,
            "eventdetails": this.calendarData.details,
            "start_date": new Date(this.calendarData.startDate).toISOString(),
            "end_date": null,
            "teacher_id": this.auth.currentUserValue.id,
            "tch_mail": this.calendarData.tch_mail,
            "student_id": this.calendarData.student_id,
            "status": this.calendarData.status,
            "approved": this.calendarData.approved,
            "completed": this.calendarData.completed,
            "assigned": this.calendarData.assigned
          }
        this.calendarService.postCalenderEvent(obj).subscribe(
          (val) => {
            this.addCusForm.reset();
            this.showNotification(
              'snackbar-success',
              'Add Record Successfully...!!!',
              'bottom',
              'center'
            );
            this.loadAll();   
          },
          (err) => {
            this.showNotification(
              'snackbar-danger',
              'Failed to add event',
              'bottom',
              'center'
            );
          }
        )
      }
    });
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
    let isDemo = false;
    if(row.event.extendedProps['stdname']) {
      isDemo = true;
      const obj:any = row.event.extendedProps;
      calendarData = {
        id: row.event.id,
        details: obj.details,
        status:obj.status,
        stdname: obj.stdname,
        teacher_id: obj.teacher_id,
        assigned: obj.assigned,
        completed: obj.completed,
        approved: obj.approved,
        startDate: row.event.start,
        endData: null
      }
    } else {
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
        status: obj.status
      };
    }


    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }

    let dialogRef: any;
    if(isDemo) {
      dialogRef = this.dialog.open(DemoDialogComponent, {
        data: {
          calendar: calendarData,
          action: 'edit',
        },
        direction: tempDirection,
      });
    } else {
      dialogRef = this.dialog.open(FormDialogComponent, {
        data: {
          calendar: calendarData,
          action: 'edit',
        },
        direction: tempDirection,
      });
    } 

    this.subs.sink = dialogRef.afterClosed().subscribe((result: any) => {
      if(isDemo) {
        this.doUpdateDemo();
      } else {
      if (result === 'submit') {
        this.calendarData = this.calendarService.getDialogData();
        const datePipe = new DatePipe('en-US');
        // const formattedStartDate = datePipe.transform(this.calendarData.startDate, 'yyyy-MM-dd');
        // const formattedEndDate = datePipe.transform(this.calendarData.endDate, 'yyyy-MM-dd');
        const obj =
          {
            "id": this.calendarData.id,
            "title": this.calendarData.title,
            "class": this.calendarData?.class,
            "eventdetails": this.calendarData.details,
            "start_date": new Date(this.calendarData.startDate).toISOString(),
            "end_date": null,
            "teacher_id": this.auth.currentUserValue.id,
            "student_id":this.calendarData.student_id,
            "tch_mail": this.calendarData.tch_mail,
            "approved":this.calendarData.approved,
            "completed": this.calendarData.completed,
            "assigned": this.calendarData.assigned,
            "status": this.calendarData.status
          }
        this.calendarService.editCalenderEvent(obj).subscribe((res) => {
          if(res) {
        this.showNotification(
          'black',
          'Edited Record Successfully...!!!',
          'bottom',
          'center'
        );
        this.addCusForm.reset();
        this.loadAll();
          }
        },
        (err) => {
          this.showNotification(
            'snackbar-danger',
            'Failed to update event',
            'bottom',
            'center'
          );
        })
      } else if (result === 'delete') {
        this.calendarData = this.calendarService.getDialogData();
        this.calendarService.deleteCalenderEvent(parseInt(this.calendarData.id)).subscribe(
          (res) => {
          if(res) {
            this.showNotification(
              'snackbar-danger',
              'Deleted Record Successfully...!!!',
              'bottom',
              'center'
            );
            location.reload();
          }              
          },
          (err) => {
            this.showNotification(
              'snackbar-danger',
              'Failed to delete event',
              'bottom',
              'center'
            );
          }
        ); 

      }
    }
    });
  }

  refresh() {
    location.reload();
  }

  doUpdateDemo() {
    this.calendarData = this.calendarService.getDialogData();  
    // this.calendarData.startDate= formatDate(new Date(this.calendarData.startDate), 'yyyy-MM-dd', 'en') || ''
    this.calendarData.startDate = new Date(this.calendarData.startDate).toISOString();
  this.auth.put('/edit/demoevent', this.calendarData).subscribe({
    next: (value) => {
      if(value) {
      this.showNotification(
        'black',
        'Edited Record Successfully...!!!',
        'bottom',
        'center'
      );
      this.addCusForm.reset();
      this.loadAll();
      } else {
        this.showNotification(
          'snackbar-danger',
          'Failed to update demo class',
          'bottom',
          'center'
        );  
      }
    },
    error: (err) => {
      this.showNotification(
        'snackbar-danger',
        'Failed to update demo class',
        'bottom',
        'center'
      );
    }
  })
  }

  editEvent(eventIndex: number, calendarData: Calendar) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const calendarEvents = this.calendarEvents!.slice();
    const singleEvent = Object.assign({}, calendarEvents[eventIndex]);
    singleEvent.id = calendarData.id;
    singleEvent.title = calendarData.title;
    singleEvent.start = calendarData.startDate;
    singleEvent.end = calendarData.endDate;
    singleEvent.className = this.getClassNameValue(calendarData.class);
    singleEvent.groupId = calendarData.class;
    singleEvent['details'] = calendarData.details;
    calendarEvents[eventIndex] = singleEvent;
    this.calendarEvents = calendarEvents; // reassign the array

    this.calendarOptions.events = calendarEvents;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleEvents(events: EventApi[]) {
    // this.currentEvents = events;
  }

  createCalendarForm(calendar: Calendar): UntypedFormGroup {
    return this.fb.group({
      id: [calendar.id],
      title: [
        calendar.title,
        [Validators.required, Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')],
      ],
      class: [calendar.class],
      startDate: [calendar.startDate, [Validators.required]],
      endDate: [calendar.endDate, [Validators.required]],
      details: [
        calendar.details,
        [Validators.required, Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')],
      ],
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
