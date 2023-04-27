import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteWatchlistModalComponent } from './invite-watchlist-modal.component';

describe('RemoveWatchlistsModalComponent', () => {
  let component: InviteWatchlistModalComponent;
  let fixture: ComponentFixture<InviteWatchlistModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteWatchlistModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteWatchlistModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
