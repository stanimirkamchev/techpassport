import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerEntityStepComponent } from './buyer-entity-step.component';

describe('BuyerEntityStepComponent', () => {
  let component: BuyerEntityStepComponent;
  let fixture: ComponentFixture<BuyerEntityStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerEntityStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerEntityStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
