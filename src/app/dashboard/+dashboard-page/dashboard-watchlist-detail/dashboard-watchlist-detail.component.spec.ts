import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardWatchlistDetailComponent } from './dashboard-watchlist-detail.component';

describe('WatchlistDetailComponent', () => {
  let component: DashboardWatchlistDetailComponent;
  let fixture: ComponentFixture<DashboardWatchlistDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardWatchlistDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardWatchlistDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
