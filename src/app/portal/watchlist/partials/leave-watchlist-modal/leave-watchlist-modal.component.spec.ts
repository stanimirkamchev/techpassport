import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveWatchlistModalComponent } from './leave-watchlist-modal.component';

describe('RemoveWatchlistsModalComponent', () => {
  let component: LeaveWatchlistModalComponent;
  let fixture: ComponentFixture<LeaveWatchlistModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveWatchlistModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveWatchlistModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
