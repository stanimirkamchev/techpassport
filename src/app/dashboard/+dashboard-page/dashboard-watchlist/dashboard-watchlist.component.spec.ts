import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardWatchlistComponent } from './dashboard-watchlist.component';

describe('DashboardWatchlistComponent', () => {
  let component: DashboardWatchlistComponent;
  let fixture: ComponentFixture<DashboardWatchlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardWatchlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardWatchlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
