import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexYAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexLegend,
  ApexMarkers,
  ApexGrid,
  ApexTitleSubtitle,
  ApexFill,
  ApexResponsive,
  ApexTheme,
  ApexNonAxisChartSeries,
} from 'ng-apexcharts';
import { AuthService } from '../../../core/service/auth.service';
import { forkJoin } from 'rxjs';
export type chartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  legend: ApexLegend;
  markers: ApexMarkers;
  grid: ApexGrid;
  title: ApexTitleSubtitle;
  colors: string[];
  responsive: ApexResponsive[];
  labels: string[];
  theme: ApexTheme;
  series2: ApexNonAxisChartSeries;
};

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  public areaChartOptions!: Partial<chartOptions>;
  public barChartOptions!: Partial<chartOptions>;
  public performanceRateChartOptions!: Partial<chartOptions>;
  public performanceRateChartOptions2!: Partial<chartOptions>;
  public polarChartOptions!: Partial<chartOptions>;
  numCls!: string;
  totalStd: any = [];
  totalTch: any = [];
  totalRegCls: any = [];
  totalDemoCls: any = [];
  allRegClasses: any = [];
  allDemoClasses: any = [];
  pay: any;
  regEarnings: any;
  demoEarnings: any;
  breadscrums = [
    {
      title: 'Dashboad',
      items: [],
      active: 'Dashboard 1',
    },
  ];
  constructor(public auth: AuthService) {
    //constructor
    this.loadStdTch();
  }

  ngOnInit() {
  }
  
  //@ts-ignore
  private chart3(wData) {
    this.performanceRateChartOptions = {
      series: [
        {
          name: 'Num of classes',
          data: [wData.sun?.length,wData.mon.length,wData.tue.length,wData.wed.length,wData.thu.length,wData.fri.length,wData.sat.length],
        },
      ],
      chart: {
        height: 350,
        type: 'line',
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        foreColor: '#9aa0ac',
        toolbar: {
          show: false,
        },
      },
      colors: ['#51E298'],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: 'smooth',
      },
      markers: {
        size: 1,
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      xaxis: {
        categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        title: {
          text: 'Weekday',
        },
      },
      yaxis: {
        title: {
          text: 'Num of classes in this week',
        },
      },
      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }
  public chart4() {
    this.polarChartOptions = {
      series2: [this.regEarnings || 0, this.demoEarnings || 0],
      chart: {
        type: 'pie',
        height: 400,
      },
      legend: {
        show: true,
        position: 'bottom',
      },
      dataLabels: {
        enabled: false,
      },
      labels: ['Regular', 'Demo'],
      colors: ['#6777ef', '#ff9800'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }

  //@ts-ignore
  private chart5(wData) {
    
    this.performanceRateChartOptions2 = {
      series: [
        {
          name: 'Num of Demo classes',
          data: [wData.sun?.length,wData.mon.length,wData.tue.length,wData.wed.length,wData.thu.length,wData.fri.length,wData.sat.length],
        },
      ],
      chart: {
        height: 350,
        type: 'line',
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        foreColor: '#9aa0ac',
        toolbar: {
          show: false,
        },
      },
      colors: ['#ff9800'],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: 'smooth',
      },
      markers: {
        size: 1,
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      xaxis: {
        categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        title: {
          text: 'Weekday',
        },
      },
      yaxis: {
        title: {
          text: 'Num of classes in this week',
        },
      },
      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }

  weekClasses() {
const data =this.allRegClasses;

const currentDate = new Date(); // Current date

// Calculate the start and end dates of the current week
const currentWeekStart = new Date(currentDate);
currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay());
currentWeekStart.setHours(0, 0, 0, 0); // Set time to 00:00:00
const currentWeekEnd = new Date(currentWeekStart);
currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
currentWeekEnd.setHours(23, 59, 59, 999); // Set time to 23:59:59

// Initialize an object with days of the week as keys
const result: any = {
  sun: [],
  mon: [],
  tue: [],
  wed: [],
  thu: [],
  fri: [],
  sat: [],
};

// Populate the result object with data
//@ts-ignore
data?.forEach(item => {
  const startDate = new Date(item.start_date);
  startDate.setHours(0, 0, 0, 0); // Set time to 00:00:00
  if (startDate >= currentWeekStart && startDate <= currentWeekEnd) {
    const dayOfWeek = startDate.toLocaleString('en-US', { weekday: 'short' }).toLowerCase();
    if (!result[dayOfWeek]) {
      result[dayOfWeek] = [];
    }
    result[dayOfWeek].push(item);
  }
});

  return result;
  }

  demoCls() {
    const data =this.allDemoClasses;
    
    const currentDate = new Date(); // Current date
    
    // Calculate the start and end dates of the current week
    const currentWeekStart = new Date(currentDate);
    currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay());
    currentWeekStart.setHours(0, 0, 0, 0); // Set time to 00:00:00
    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
    currentWeekEnd.setHours(23, 59, 59, 999); // Set time to 23:59:59
    
    // Initialize an object with days of the week as keys
    const result: any = {
      sun: [],
      mon: [],
      tue: [],
      wed: [],
      thu: [],
      fri: [],
      sat: [],
    };
    
    // Populate the result object with data
    //@ts-ignore
    data?.forEach(item => {
      const startDate = new Date(item.startDate);
      startDate.setHours(0, 0, 0, 0); // Set time to 00:00:00
      if (startDate >= currentWeekStart && startDate <= currentWeekEnd) {
        const dayOfWeek = startDate.toLocaleString('en-US', { weekday: 'short' }).toLowerCase();
        if (!result[dayOfWeek]) {
          result[dayOfWeek] = [];
        }
        result[dayOfWeek].push(item);
      }
    });
    
      return result;
      }

  loadStdTch() {
    const getStudents$ = this.auth.get('/getstds');
    const getTeachers$ = this.auth.get('/teachers');
    const getRegClasses$ = this.auth.get('/getTeacherEvents');
    const payment$ = this.auth.get('/get/pricings');
    const demo$ = this.auth.get('/get/demoevent');
    const numClasses$ = this.auth.get('/allclasses');
    forkJoin([getStudents$, getTeachers$, getRegClasses$, payment$, demo$, numClasses$]).subscribe({
      next: ([std, tch, cls, pay,demo, numCls]) => {
        this.numCls = numCls;
         this.totalStd = std;
         this.totalTch = tch;
         this.pay = (pay && pay.length) ? pay[0] : null;
         this.allDemoClasses = demo;
         if (demo) {
          this.totalDemoCls = demo.filter((v: any) => v.approved);
        } else {
          this.totalDemoCls = [];
        }
         this.totalRegCls = this.approvedCls(cls);
         this.findDemoEarnings();
         this.chart4();
         const wData = this.weekClasses();
         if(wData) {
          this.chart3(wData);
         }
         const demoData = this.demoCls();
         if(demoData) {
          this.chart5(demoData);
         }
      },
      error: (err) => {

      }
    })
  }

  findDemoEarnings() {
    this.demoEarnings = ((this.totalDemoCls.length) * this.pay.demo_pricing);
  }

  // @ts-ignore
  //@ts-nocheck
  approvedCls(cls) {
    if(cls && cls.length) {
      // @ts-ignore
      this.allRegClasses = cls;
      // @ts-ignore
      const list = cls.filter(el => el.approved);
     this.regEarnings = ((list.length) * this.pay.paid_pricing); 
      return list 
    }
    return [];
  }
}
