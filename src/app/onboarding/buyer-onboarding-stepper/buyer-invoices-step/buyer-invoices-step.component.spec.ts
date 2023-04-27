import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerInvoicesStepComponent } from './buyer-invoices-step.component';

describe('BuyerInvoicesStepComponent', () => {
  let component: BuyerInvoicesStepComponent;
  let fixture: ComponentFixture<BuyerInvoicesStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerInvoicesStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerInvoicesStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
