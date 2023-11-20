import { Component } from '@angular/core';
import { AuthService } from '../../core/service/auth.service';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';
import { ComponentsModule } from '../../shared/components/components.module';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TemplateRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-all-earnings',
  templateUrl: './all-earnings.component.html',
  styleUrls: ['./all-earnings.component.scss'],
  standalone: true,
  imports: [LoadingBarRouterModule,
    ComponentsModule,
    SharedModule]
})
export class AllEarningsComponent {

  months: any[] = [];
  earningsData: any;
  selectedMonth: any;
  prices = {paid:0, demo:0};
  tch: any =[];
  selectedTeacher: any;


  breadscrums = [
  {
      title: 'Earnings',
      items: [],
      active: 'Earnings',
    },
  ];
  totalEarning!: number;
  finalVal: any;
  apiData: any;
  @ViewChild('formDialogTemplate') formDialogTemplate!: TemplateRef<any>;
  form: FormGroup;

  constructor(public auth: AuthService, private dialog: MatDialog,
    public httpClient: HttpClient, private snackBar: MatSnackBar, private fb: FormBuilder) {
    this.getPrices();
      this.buildMonths();
    // this.selectedMonth = this.months[0];
    // this.fetchEarnings();
    this.getTeachers();

    this.form = this.fb.group({
      paid: ['', [Validators.required, Validators.min(0)]],
      demo: ['', [Validators.required, Validators.min(0)]]
    });
  }

  getPrices() {
    this.auth.get('/get/pricings').subscribe({
      next: (value: any) => {
        if(value &&value.length) {
        this.prices = {
          demo: parseFloat(value[0].demo_pricing),
          paid: parseFloat(value[0].paid_pricing)
        }
      }
      },
      error: (err: any) => {

      }
    })
  }

  buildMonths() {
    const now = new Date();
    let presentMonth = this.getMonthName(now.getMonth() + 1);    
    for (let i = 0; i >= -2; i--) {
      const month = this.getMonthName(now.getMonth() + i);
      let obj: any= {};
      if(i === 0) {
        obj.name = 'currentMonth';
      } else if(i == -1) {
        obj.name = 'lastMonth';
      }
      else if(i == -2) {
        obj.name = 'beforeLastMonth';
      }
      obj.value = month
      this.months.push(obj);
    }
  }

  openDialog(): void {
    this.dialog.open(this.formDialogTemplate, {
      width: 'auto',
      height: 'auto'
    });
  }
  
  closeDialog(): void {
    this.dialog.closeAll();
  }

  onSubmit(): void {
    if (this.form.valid) {
      // Handle form submission logic here
      const info = this.form.getRawValue(); 
      const obj = {
        demo_pricing: info.demo,
        paid_pricing: info.paid
      }
      this.auth.post('/add/pricings', obj).subscribe({
        next: (value: any) => {
          if(value) {
          this.showNotification(
            'snackbar-success',
            'Added pricing Successfully...!!!',
            'bottom',
            'center'
          );
          location.reload();
          }
        },
        error: (err: any) => {

        }
      }) 
      // Close the dialog
      this.closeDialog();
    }
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
  

  chooseTeacher() {
    if(this.selectedTeacher) {
      this.fetchEarnings()
    }
  }


  getMonthName(monthIndex: number): string {
    const months = [
      "January", "February", "March", "April",
      "May", "June", "July", "August",
      "September", "October", "November", "December"
    ];

    return months[monthIndex];
  }

  calculateTotalEarnings(earningsObject: any) {
    const demoEarnings = parseFloat(earningsObject.demo_erng);
    const paidEarnings = parseFloat(earningsObject.paid_erng);
    const incentiveEarnings = parseFloat(earningsObject.incentive_erng);

    const totalEarnings = demoEarnings + paidEarnings + incentiveEarnings;

    return totalEarnings;
}

chooseEarnings() {
this.formView(this.apiData);
}

fetchEarnings(): any {
  this.totalEarning = 0; 
  const id = this.selectedTeacher.id
  this.auth.get(`/earnings?id=${id}`).subscribe({
    next: (v) => {
      this.apiData = v;
      this.formView(v);
    },
    error: (e) => e
  })

}
  
formView(v: any) {
  if(this.selectedMonth && this.selectedMonth.name) {
  for(var i of Object.keys(v)) {
    if (i == this.selectedMonth?.name) {
      this.earningsData = {
        paid: v[i]['paid'],
        demo: v[i]['demo']
      }
    }
  }
  this.totalEarning = Object.keys(this.earningsData).reduce((total, type) => {
    return total + (this.earningsData[type as keyof typeof this.earningsData] * this.prices[type as keyof typeof this.prices]);
  }, 0);
}
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


}
