import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllEarningsComponent } from './all-earnings/all-earnings.component';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'teachers',
    loadChildren: () =>
      import('./teachers/teachers.module').then((m) => m.TeachersModule),
  },
  {
    path: 'students',
    loadChildren: () =>
      import('./students/students.module').then((m) => m.StudentsModule),
  },
  {
    path: 'courses',
    loadChildren: () =>
      import('./courses/courses.module').then((m) => m.CoursesModule),
  },
  {
    path: 'allearnings',
    loadComponent: () =>
      import('./all-earnings/all-earnings.component').then((x) => x.AllEarningsComponent),
  },
  {
    path: 'curriculum',
    loadComponent: () =>
      import('./curriculum/curriculum.component').then((x) => x.CurriculumComponent),
  },
  {
    path: 'curriculum-list',
    loadComponent: () =>
      import('./curriculum-list/curriculum-list.component').then((x) => x.CurriculumListComponent),
  },
  {
    path: 'curriculum-view',
    loadComponent: () =>
      import('./view-curriculum/view-curriculum.component').then((x) => x.ViewCurriculumComponent),
  },
  {
    path: 'support',
    loadComponent: () =>
      import('./admin-support/admin-support.component').then((x) => x.AdminSupportComponent),
  },
  {
    path: 'library',
    loadChildren: () =>
      import('./library/library.module').then((m) => m.LibraryModule),
  },
  {
    path: 'departments',
    loadChildren: () =>
      import('./departments/departments.module').then(
        (m) => m.DepartmentsModule
      ),
  },
  {
    path: 'staff',
    loadChildren: () =>
      import('./staff/staff.module').then((m) => m.StaffModule),
  },
  {
    path: 'holidays',
    loadChildren: () =>
      import('./holidays/holidays.module').then((m) => m.HolidaysModule),
  },
  {
    path: 'fees',
    loadChildren: () => import('./fees/fees.module').then((m) => m.FeesModule),
  },
  {
    path: 'attendance',
    loadChildren: () =>
      import('./attendance/attendance.module').then((m) => m.AttendanceModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
