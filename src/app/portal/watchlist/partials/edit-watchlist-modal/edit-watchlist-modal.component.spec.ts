import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWatchlistModalComponent } from './edit-watchlist-modal.component';

describe('RemoveWatchlistsModalComponent', () => {
  let component: EditWatchlistModalComponent;
  let fixture: ComponentFixture<EditWatchlistModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditWatchlistModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWatchlistModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
