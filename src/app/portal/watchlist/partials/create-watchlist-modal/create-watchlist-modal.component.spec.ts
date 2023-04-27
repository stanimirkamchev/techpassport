import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWatchlistModalComponent } from './create-watchlist-modal.component';

describe('RemoveWatchlistsModalComponent', () => {
  let component: CreateWatchlistModalComponent;
  let fixture: ComponentFixture<CreateWatchlistModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateWatchlistModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWatchlistModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
