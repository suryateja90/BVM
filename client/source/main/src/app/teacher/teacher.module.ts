import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgChartsModule } from 'ng2-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
} from '@danielmoncada/angular-datetime-picker';

import { TeacherRoutingModule } from './teacher-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LecturesComponent } from './lectures/lectures.component';
import { DeleteDialogComponent } from './lectures/dialogs/delete/delete.component';
import { FormDialogComponent } from './lectures/dialogs/form-dialog/form-dialog.component';
import { LeaveRequestComponent } from './leave-request/leave-request.component';
import { SettingsComponent } from './settings/settings.component';
import { ExamScheduleComponent } from './exam-schedule/exam-schedule.component';
import { LecturesService } from './lectures/lectures.service';
import { LeaveRequestService } from './leave-request/leave-request.service';
import { ExamScheduleService } from './exam-schedule/exam-schedule.service';
import { SharedModule } from '@shared';
import { ComponentsModule } from '@shared/components/components.module';
import { StudentDisplayComponent } from './student-display/student-display.component';
import { StudentsDisplayService } from './student-display/studentDisplayService';
import { TeacherSupportComponent } from './teacher-support/teacher-support.component';
import { EarningsComponent } from './earnings/earnings.component';
import { CalendarService } from '../calendar/calendar.service';
import { MyScheduleComponent } from './my-schedule/my-schedule.component';
import { TeachersService } from '../admin/teachers/all-teachers/teachers.service';

@NgModule({
  declarations: [
    DashboardComponent,
    LecturesComponent,
    DeleteDialogComponent,
    FormDialogComponent,
    LeaveRequestComponent,
    SettingsComponent,
    ExamScheduleComponent,
    StudentDisplayComponent,
    TeacherSupportComponent,
    EarningsComponent,
    MyScheduleComponent,
  ],
  imports: [
    CommonModule,
    TeacherRoutingModule,
    NgChartsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    FormsModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    NgApexchartsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ComponentsModule,
    SharedModule,
  ],
  providers: [LecturesService,CalendarService, LeaveRequestService,TeachersService, ExamScheduleService, StudentsDisplayService],
})
export class TeacherModule {}
