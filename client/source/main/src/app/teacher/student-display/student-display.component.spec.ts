import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDisplayComponent } from './student-display.component';

describe('StudentDisplayComponent', () => {
  let component: StudentDisplayComponent;
  let fixture: ComponentFixture<StudentDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentDisplayComponent]
    });
    fixture = TestBed.createComponent(StudentDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
