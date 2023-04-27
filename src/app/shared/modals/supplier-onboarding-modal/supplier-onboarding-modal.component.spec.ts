import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierOnboardingModalComponent } from './supplier-onboarding-modal.component';

describe('SupplierOnboardingModalComponent', () => {
  let component: SupplierOnboardingModalComponent;
  let fixture: ComponentFixture<SupplierOnboardingModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierOnboardingModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierOnboardingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
