import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OuterMarketPageComponent } from './outer-market-page.component';

describe('OuterMarketPageComponent', () => {
  let component: OuterMarketPageComponent;
  let fixture: ComponentFixture<OuterMarketPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OuterMarketPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OuterMarketPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
