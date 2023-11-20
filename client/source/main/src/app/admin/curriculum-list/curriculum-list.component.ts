import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/service/auth.service';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { ComponentsModule } from '../../shared/components/components.module';
import { SharedModule } from '../../shared/shared.module';
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-curriculum-list',
  standalone: true,
  imports: [CommonModule,
    LoadingBarRouterModule,
    ComponentsModule,
    SharedModule],
  templateUrl: './curriculum-list.component.html',
  styleUrls: ['./curriculum-list.component.scss']
})
export class CurriculumListComponent {

  gradesInfo: any =[];
  cInfo: any = [];
  private route = inject(ActivatedRoute);

  constructor(public auth: AuthService, public router: Router) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
   this.loadAll();
  }

  loadAll() {
    const ccl = this.auth.get('/allcurriculum');
    const gr = this.auth.get('/grades');
    forkJoin([gr,ccl]).subscribe({
      next: ([gRes,cRes]) => {
        this.gradesInfo = gRes;
        this.cInfo = cRes;
        this.isC();
      },
      error: (err) => {

      }
    })
  }

removeRow(item: any) {
  let body = this.cInfo.filter((v: any) => v.grade_id === item.id);
  let c: any= [];
  body.forEach((v: any) => {
    c.push(v['id'])
  })
  this.auth.post('/delete/allcurriculum', c).subscribe({
    next: (value: boolean) => {
      if(value) {
        this.auth.showNotification(
          'snackbar-success',
          'Deleted curriculum Successfully...!!!',
          'bottom',
          'center'
        );
       location.reload();
      }
      else {
        this.auth.showNotification(
          'snackbar-warn',
          'Failed deleting curriculum',
          'bottom',
          'center'
        );
      }
    },
    error: (err: any) => {
      this.auth.showNotification(
        'snackbar-warn',
        'Failed deleting curriculum',
        'bottom',
        'center'
      );
    }
  })
}

viewItem(item: any) {
  localStorage.setItem('cData', JSON.stringify({item: item, grade: this.gradesInfo, ccl: this.cInfo}));
  this.router.navigate(['/admin/curriculum-view', {id: item.id}]);
}


editCall(item: any) {
  this.router.navigate(['/admin/curriculum', {id: item.id, mode: 'edit'}]);
}

addItem(item: any) {
  this.router.navigate(['/admin/curriculum', {id: item.id}]);
}

isC(){
  this.gradesInfo.forEach((v: any) => {
    this.cInfo?.forEach((c: any) => {
      if(Number(c.grade_id) === Number(v.id)) {
        v.hasCCL = true;
      } 
    })
  });
}

}
