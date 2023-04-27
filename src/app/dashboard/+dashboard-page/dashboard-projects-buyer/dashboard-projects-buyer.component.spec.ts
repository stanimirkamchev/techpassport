import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardProjectsBuyerComponent } from './dashboard-projects-buyer.component';

describe('DashboardProjectsBuyerComponent', () => {
  let component: DashboardProjectsBuyerComponent;
  let fixture: ComponentFixture<DashboardProjectsBuyerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardProjectsBuyerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardProjectsBuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
