import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OuterMarketTableComponent } from './outer-market-table.component';

describe('OuterMarketTableComponent', () => {
  let component: OuterMarketTableComponent;
  let fixture: ComponentFixture<OuterMarketTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OuterMarketTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OuterMarketTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
