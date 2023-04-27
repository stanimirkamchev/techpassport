import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumPlanComponent } from './premium-plan.component';

describe('PremiumPlanComponent', () => {
  let component: PremiumPlanComponent;
  let fixture: ComponentFixture<PremiumPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiumPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiumPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
