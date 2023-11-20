import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';
import { TeachersService } from '../all-teachers/teachers.service';

@Component({
  selector: 'app-about-teacher',
  templateUrl: './about-teacher.component.html',
  styleUrls: ['./about-teacher.component.scss'],
})
export class AboutTeacherComponent {
  breadscrums = [
    {
      title: 'Profile',
      items: ['Teacher'],
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
