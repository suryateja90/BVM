import { Component } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CalendarService } from '../../calendar/calendar.service';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-my-schedule',
  templateUrl: './my-schedule.component.html',
  styleUrls: ['./my-schedule.component.scss']
})
export class MyScheduleComponent {
timelineData!: any;
selectedDay = 'Today';
std: any = [];
months = [
  { name: 'January', number: 1 },
  { name: 'February', number: 2 },
  { name: 'March', number: 3 },
  { name: 'April', number: 4 },
  { name: 'May', number: 5 },
  { name: 'June', number: 6 },
  { name: 'July', number: 7 },
  { name: 'August', number: 8 },
  { name: 'September', number: 9 },
  { name: 'October', number: 10 },
  { name: 'November', number: 11 },
  { name: 'December', number: 12 }
];

days = ['Today', 'Tommorrow', 'Yesterday'];
  constructor(public calendarService: CalendarService,public auth: AuthService) {
    this.loadAll();
  }

  loadAll() {
    const getMyEvents$ = this.calendarService.getAllCalendars(this.auth.currentUserValue.id);
    const getDemoEvent$ = this.auth.get(`/get/demoevent?id=${this.auth.currentUserValue.id}`);
    forkJoin([getMyEvents$, getDemoEvent$]).subscribe({
      next: ([myEventsResponse, demoEventResponse]) => {
        // Handle the responses here
        const myEvents = myEventsResponse;
        const demoEvents = demoEventResponse?.filter((e:any) => (e.teacher_id === this.auth.currentUserValue.id));
        this.getStd(myEvents, demoEvents);

      },
      error: error => {
        // Handle any errors
      }
    })
  };


  setData(myEvents: any, demoevents: any) {
    let today: any = new Date();
    let yesterday: any = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    let tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    let rightDate: any;
    if (this.selectedDay == 'Today') {
      rightDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    }
    else if (this.selectedDay == 'Tommorrow') {
      rightDate = tomorrow.toISOString().split('T')[0];
    } else if (this.selectedDay == 'Yesterday') {
      rightDate = yesterday.toISOString().split('T')[0];
    }

    const filteredDemo = demoevents?.filter((obj: any) => {
      obj.demo = true;
      return obj.startDate.split('T')[0] === rightDate;
    }) ?? [];
    
    const filteredEvents = myEvents?.filter((obj: any) => {
      obj.regular = true;
      return obj.start_date.split('T')[0] === rightDate;
    }) ?? [];
    
    this.timelineData = [...filteredDemo, ...filteredEvents];
    
    myEvents?.forEach((teacher: any) => {
      let matchingStudent = this.std.find((student: any) => student.id === teacher.student_id);
      if (matchingStudent) {
        teacher.stdname = matchingStudent.name;
      }
    });
  }


getStd(myEvents: any, demoEvents: any) {
  this.auth.get('//getstds').subscribe({
    next: (value) => { 
      this.std = value;
      this.setData(myEvents, demoEvents);
      this.calendarService.teacherData.next({std:value, myEvents: myEvents, demoEvents: demoEvents})
    },
    error: (err) => {
        // Handle errors
    },
}) 
}


}
