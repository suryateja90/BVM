import { Component } from '@angular/core';
import { AuthService } from '@core';

@Component({
  selector: 'app-earnings',
  templateUrl: './earnings.component.html',
  styleUrls: ['./earnings.component.scss']
})
export class EarningsComponent {
  months: any[] = [];
  earningsData: any;
  selectedMonth: any;
  prices = {paid:200, demo:100}

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

  constructor(public auth: AuthService) {
    const now = new Date();
    let presentMonth = this.getMonthName(now.getMonth() + 1);
    // this.months.push({name:'currentMonth', value: presentMonth});
    
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
    this.selectedMonth = this.months[0];
    this.getPrices();
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

getPrices() {
  this.auth.get('/get/pricings').subscribe({
    next: (value: any) => {
      this.prices = {
        demo: parseFloat(value[0].demo_pricing),
        paid: parseFloat(value[0].paid_pricing)
      }
      this.fetchEarnings();
    },
    error: (err: any) => {

    }
  })
}

fetchEarnings(): any {
  this.totalEarning = 0; 
  this.auth.get(`/earnings?id=${this.auth.currentUserValue.id}`).subscribe({
    next: (v) => {
      this.apiData = v;
      this.formView(v);
    },
    error: (e) => e
  })

}
  
formView(v: any) {
  for(var i of Object.keys(v)) {
    if (i == this.selectedMonth.name) {
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
