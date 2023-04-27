import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveWatchlistsModalComponent } from './remove-watchlists-modal.component';

describe('RemoveWatchlistsModalComponent', () => {
  let component: RemoveWatchlistsModalComponent;
  let fixture: ComponentFixture<RemoveWatchlistsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveWatchlistsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveWatchlistsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
