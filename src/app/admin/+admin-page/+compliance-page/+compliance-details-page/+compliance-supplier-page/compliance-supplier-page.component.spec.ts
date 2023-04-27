import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceSupplierPageComponent } from './compliance-supplier-page.component';

describe('ComplianceSupplierPageComponent', () => {
  let component: ComplianceSupplierPageComponent;
  let fixture: ComponentFixture<ComplianceSupplierPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplianceSupplierPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceSupplierPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
