import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerGroupCompanyStepComponent } from './buyer-group-company-step.component';

describe('BuyerGroupCompanyStepComponent', () => {
  let component: BuyerGroupCompanyStepComponent;
  let fixture: ComponentFixture<BuyerGroupCompanyStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerGroupCompanyStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerGroupCompanyStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
