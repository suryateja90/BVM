import { ExamScheduleComponent } from './exam-schedule/exam-schedule.component';
import { LecturesComponent } from './lectures/lectures.component';
import { Page404Component } from './../authentication/page404/page404.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LeaveRequestComponent } from './leave-request/leave-request.component';
import { SettingsComponent } from './settings/settings.component';
import { StudentDisplayComponent } from './student-display/student-display.component';
import { TeacherSupportComponent } from './teacher-support/teacher-support.component';
import { EarningsComponent } from './earnings/earnings.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'lectures',
    component: LecturesComponent,
  },
  {
    path: 'leave-request',
    component: LeaveRequestComponent,
  },
  {
    path: 'students',
    component: StudentDisplayComponent
  },
  {
    path:'teacher-support',
    component: TeacherSupportComponent
  },
  {
    path: 'exam-schedule',
    component: ExamScheduleComponent,
  },
  {
    path: 'earnings',
    component: EarningsComponent
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  { path: '**', component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeacherRoutingModule {}
