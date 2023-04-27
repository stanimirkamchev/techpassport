import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyWatchlistsComponent } from './my-watchlists.component';

describe('MyWatchlistsComponent', () => {
  let component: MyWatchlistsComponent;
  let fixture: ComponentFixture<MyWatchlistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyWatchlistsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyWatchlistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
