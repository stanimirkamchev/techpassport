import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerSanctionsStepComponent } from './buyer-sanctions-step.component';

describe('BuyerSanctionsStepComponent', () => {
  let component: BuyerSanctionsStepComponent;
  let fixture: ComponentFixture<BuyerSanctionsStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerSanctionsStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerSanctionsStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
