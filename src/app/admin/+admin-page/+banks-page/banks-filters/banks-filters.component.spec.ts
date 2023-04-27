import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BanksFiltersComponent } from './banks-filters.component';

describe('BanksFiltersComponent', () => {
  let component: BanksFiltersComponent;
  let fixture: ComponentFixture<BanksFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BanksFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BanksFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
