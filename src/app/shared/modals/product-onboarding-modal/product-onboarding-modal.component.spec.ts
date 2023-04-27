import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductOnboardingModalComponent } from './product-onboarding-modal.component';

describe('ProductOnboardingModalComponent', () => {
  let component: ProductOnboardingModalComponent;
  let fixture: ComponentFixture<ProductOnboardingModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductOnboardingModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductOnboardingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
