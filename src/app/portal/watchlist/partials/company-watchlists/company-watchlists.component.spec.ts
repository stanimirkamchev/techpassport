import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyWatchlistsComponent } from './company-watchlists.component';

describe('MyWatchlistsComponent', () => {
  let component: CompanyWatchlistsComponent;
  let fixture: ComponentFixture<CompanyWatchlistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyWatchlistsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyWatchlistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
