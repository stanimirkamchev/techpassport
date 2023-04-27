import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyOnboardingStepperComponent } from './company-onboarding-stepper.component';

describe('CompanyOnboardingStepperComponent', () => {
  let component: CompanyOnboardingStepperComponent;
  let fixture: ComponentFixture<CompanyOnboardingStepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyOnboardingStepperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyOnboardingStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
