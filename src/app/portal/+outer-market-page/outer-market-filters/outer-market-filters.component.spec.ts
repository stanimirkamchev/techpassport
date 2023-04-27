import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OuterMarketFiltersComponent } from './outer-market-filters.component';

describe('OuterMarketFiltersComponent', () => {
  let component: OuterMarketFiltersComponent;
  let fixture: ComponentFixture<OuterMarketFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OuterMarketFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OuterMarketFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
