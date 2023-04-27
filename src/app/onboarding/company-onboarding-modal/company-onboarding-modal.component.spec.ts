import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyOnboardingModalComponent } from './company-onboarding-modal.component';

describe('CompanyOnboardingModalComponent', () => {
  let component: CompanyOnboardingModalComponent;
  let fixture: ComponentFixture<CompanyOnboardingModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyOnboardingModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyOnboardingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
