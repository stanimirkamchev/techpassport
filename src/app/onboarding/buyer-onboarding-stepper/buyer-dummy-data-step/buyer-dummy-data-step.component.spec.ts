import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerDummyDataStepComponent } from './buyer-dummy-data-step.component';

describe('BuyerDummyDataStepComponent', () => {
  let component: BuyerDummyDataStepComponent;
  let fixture: ComponentFixture<BuyerDummyDataStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerDummyDataStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerDummyDataStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
