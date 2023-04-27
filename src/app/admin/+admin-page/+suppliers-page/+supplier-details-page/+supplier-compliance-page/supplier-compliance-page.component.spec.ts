import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierCompliancePageComponent } from './supplier-compliance-page.component';

describe('SupplierCompliancePageComponent', () => {
  let component: SupplierCompliancePageComponent;
  let fixture: ComponentFixture<SupplierCompliancePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierCompliancePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierCompliancePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
