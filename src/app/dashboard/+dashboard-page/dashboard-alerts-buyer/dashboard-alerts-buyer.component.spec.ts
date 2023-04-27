import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAlertsBuyerComponent } from './dashboard-alerts-buyer.component';

describe('DashboardAlertsBuyerComponent', () => {
  let component: DashboardAlertsBuyerComponent;
  let fixture: ComponentFixture<DashboardAlertsBuyerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardAlertsBuyerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardAlertsBuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
