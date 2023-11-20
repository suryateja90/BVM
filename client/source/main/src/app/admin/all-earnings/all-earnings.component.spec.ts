import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEarningsComponent } from './all-earnings.component';

describe('AllEarningsComponent', () => {
  let component: AllEarningsComponent;
  let fixture: ComponentFixture<AllEarningsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllEarningsComponent]
    });
    fixture = TestBed.createComponent(AllEarningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
