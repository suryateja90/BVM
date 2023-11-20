import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';
import { TeachersService } from '../../teachers/all-teachers/teachers.service';

@Component({
  selector: 'app-about-student',
  templateUrl: './about-student.component.html',
  styleUrls: ['./about-student.component.scss'],
})
export class AboutStudentComponent {
  breadscrums = [
    {
      title: 'Profile',
      items: ['Student'],
      active: 'Profile',
    },
  ];
  info: any;
  constructor(public auth: AuthService, public router: Router, public tService: TeachersService) {
    // constructor

    if(this.tService.getTeach()) {
      this.info = this.tService.getTeach();
    } else {
      history.back();
    }
  }
}
