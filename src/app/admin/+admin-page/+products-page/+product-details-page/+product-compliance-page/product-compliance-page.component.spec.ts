import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCompliancePageComponent } from './product-compliance-page.component';

describe('ProductCompliancePageComponent', () => {
  let component: ProductCompliancePageComponent;
  let fixture: ComponentFixture<ProductCompliancePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductCompliancePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCompliancePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
