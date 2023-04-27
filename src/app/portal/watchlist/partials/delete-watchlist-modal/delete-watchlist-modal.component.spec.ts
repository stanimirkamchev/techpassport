import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteWatchlistModalComponent } from './delete-watchlist-modal.component';

describe('RemoveWatchlistsModalComponent', () => {
  let component: DeleteWatchlistModalComponent;
  let fixture: ComponentFixture<DeleteWatchlistModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteWatchlistModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteWatchlistModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
