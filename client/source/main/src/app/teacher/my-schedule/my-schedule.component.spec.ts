import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyScheduleComponent } from './my-schedule.component';

describe('MyScheduleComponent', () => {
  let component: MyScheduleComponent;
  let fixture: ComponentFixture<MyScheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyScheduleComponent]
    });
    fixture = TestBed.createComponent(MyScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
