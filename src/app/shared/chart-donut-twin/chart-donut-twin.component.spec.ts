import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartDonutTwinComponent } from './chart-donut-twin.component';

describe('ChartDonutTwinComponent', () => {
  let component: ChartDonutTwinComponent;
  let fixture: ComponentFixture<ChartDonutTwinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartDonutTwinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartDonutTwinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
