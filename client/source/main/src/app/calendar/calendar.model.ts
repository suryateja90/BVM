import { formatDate } from '@angular/common';
export class Calendar {
  id: string;
  title: string;
  class: string;
  startDate: string;
  endDate: string;
  details: string;
  teacher?: number;
  stdname?: string;
  teacher_id?: number;
  assigned?: boolean;
  approved?: boolean;
  completed?: boolean;
  status?: string;
  tch_mail?: string;
  student_id?: number;

  constructor(calendar: Calendar) {
    {
      this.id = calendar.id || '';
      this.title = calendar.title || '';
      this.class = calendar.class || '';
      this.startDate = formatDate(new Date(), 'yyyy-MM-dd', 'en') || '';
      this.endDate = formatDate(new Date(), 'yyyy-MM-dd', 'en') || '';
      this.details = calendar.details || '';
      this.teacher = calendar.teacher;
      this.stdname = calendar.stdname || '';
      this.approved = calendar.approved;
      this.assigned = calendar.assigned;
      this.completed = calendar.completed;
      this.status = calendar.status || 'assigned';
      this.student_id = calendar.student_id;
      this.tch_mail = calendar.tch_mail
    }
  }
  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
