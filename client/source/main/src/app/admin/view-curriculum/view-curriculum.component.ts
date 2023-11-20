import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { ComponentsModule } from '../../shared/components/components.module';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-view-curriculum',
  standalone: true,
  imports:[CommonModule,
    LoadingBarRouterModule,
    ComponentsModule,
    SharedModule],
  templateUrl: './view-curriculum.component.html',
  styleUrls: ['./view-curriculum.component.scss']
})
export class ViewCurriculumComponent implements OnDestroy {
  cData: any;
  item: any;
  grade: any;
  ccl: any;

  constructor() {
   this.cData =  JSON.parse(localStorage.getItem('cData') || '{}');
   this.grade = this.cData.grade;
   this.item = this.cData.item;
   this.loadAccData();
  }

  loadAccData() {
  this.ccl = this.cData.ccl.filter((val: any) => {
      return (val.grade_id === this.item.id);
    });
  }


  goBack() {
    history.back();
  }

  ngOnDestroy() {
    // Remove data from local storage
    localStorage.removeItem('cData');
  }

}
