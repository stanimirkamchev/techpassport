import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerOnboardingStepperComponent } from './buyer-onboarding-stepper.component';

describe('BuyerOnboardingStepperComponent', () => {
  let component: BuyerOnboardingStepperComponent;
  let fixture: ComponentFixture<BuyerOnboardingStepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerOnboardingStepperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerOnboardingStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
