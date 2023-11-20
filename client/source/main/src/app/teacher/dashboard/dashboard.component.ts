import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexYAxis,
  ApexStroke,
  ApexLegend,
  ApexMarkers,
  ApexGrid,
  ApexFill,
  ApexTitleSubtitle,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexPlotOptions,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

import { forkJoin } from 'rxjs';
import { CalendarService } from '../../calendar/calendar.service';
import { AuthService } from '../../core/service/auth.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;
  public earningsChart: Partial<ChartOptions> | any;
  demoClasses: any;
  prices: any;
  myClasses: any = [];
  breadscrums = [
    {
      title: 'Dashboard',
      items: ['Teacher'],
      active: 'Dashboard',
    },
  ];

  constructor(public calendarService: CalendarService, public auth: AuthService) {
    const currentDate = new Date();

// Get the current month, last month, and before last month
const currentMonth = currentDate.toLocaleString('default', { month: 'short' });
currentDate.setMonth(currentDate.getMonth() - 1);
const lastMonth = currentDate.toLocaleString('default', { month: 'short' });
currentDate.setMonth(currentDate.getMonth() - 1);
const beforeLastMonth = currentDate.toLocaleString('default', { month: 'short' });

    this.chartOptions = {
      series: [
        {
          name: "Net Profit",
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        },
        {
          name: "Revenue",
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
        },
        {
          name: "Free Cash Flow",
          data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
        
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: [currentMonth, lastMonth, beforeLastMonth]
      },
      yaxis: {
        title: {
          text: "No of classes"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val: any) {
            return val + "classes";
          }
        }
      }
    };

  this.buildEarningsChart(currentMonth,lastMonth,beforeLastMonth);
  }

  ngOnInit(): void {
    this.loadChart();
    this.calendarService.teacherData.subscribe((val: any) => {
      if(val) {
      let final:any = [];
      let reg = val.myEvents;
      let demo = val.demoEvents;
      reg?.forEach((e: any) => {
        let ob = {
          std: e.stdname,
          status: e.status,
          type: 'Regular'
        }
        final.push(ob);
      });
      demo?.forEach((e: any) => {
        let ob = {
          std: e.stdname,
          status: e.status,
          type: 'Demo'
        }
        final.push(ob);
      })
      this.myClasses = final;
      }
    })
  }

  buildEarningsChart(cm: any,lm: any,blm: any) {
    this.earningsChart = {
      series: [{
        name: "Paid Earnings",
      data: []
    }, {
      name: "Demo Earnings",
      data: []
    }],
      chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: 'top',
        },
      }
    },
    dataLabels: {
      enabled: true,
      offsetX: -6,
      style: {
        fontSize: '12px',
        colors: ['#fff']
      }
    },
    stroke: {
      show: true,
      width: 1,
      colors: ['#fff']
    },
    tooltip: {
      y: {
        formatter: function(val: any) {
          return val + "rs/-";
        }
      }
    },
    xaxis: {
      categories: [cm,lm,blm],
    },
    yaxis: {
      title: {
        text: "Earnings"
      }
    },
    };
  }

  loadChart() {
    const id = this.auth.currentUserValue.id;
    this.auth.get(`/earnings?id=${id}`).subscribe({
      next: (v) => {
        this.auth.get('/get/pricings').subscribe({
          next: (value: any) => {
            this.prices = {
              demo: parseFloat(value[0].demo_pricing),
              paid: parseFloat(value[0].paid_pricing)
            }
            this.allClassesChart(v);
          },
          error: (err: any) => {
    
          }
        })

      },
      error: (e) => e
    })
  }



  allClassesChart(value: any) {
    if(value) {
    this.chartOptions.series = [{
      name: 'Paid',
      data: [value.currentMonth.paid, value.lastMonth.paid, value.beforeLastMonth.paid]
    },{
      name: 'Demo',
      data: [value.currentMonth.demo, value.lastMonth.demo, value.beforeLastMonth.demo]
    }];
    const demoPrice = this.prices.demo;
const paidPrice = this.prices.paid;

this.earningsChart.series = [
  {
    data: [
      value.currentMonth.paid * paidPrice,
      value.lastMonth.paid * paidPrice,
      value.beforeLastMonth.paid * paidPrice
    ]
  },
  {
    data: [
      value.currentMonth.demo * demoPrice,
      value.lastMonth.demo * demoPrice,
      value.beforeLastMonth.demo * demoPrice
    ]
  }
];
    }
  }

  arrangeEarningsChart() {
     }
}
