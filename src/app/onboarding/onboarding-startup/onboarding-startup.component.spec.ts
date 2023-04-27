import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingStartupComponent } from './onboarding-startup.component';

describe('OnboardingStartupComponent', () => {
  let component: OnboardingStartupComponent;
  let fixture: ComponentFixture<OnboardingStartupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardingStartupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingStartupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
