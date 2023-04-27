import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerOnboardingModalComponent } from './buyer-onboarding-modal.component';

describe('BuyerOnboardingModalComponent', () => {
  let component: BuyerOnboardingModalComponent;
  let fixture: ComponentFixture<BuyerOnboardingModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerOnboardingModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerOnboardingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
