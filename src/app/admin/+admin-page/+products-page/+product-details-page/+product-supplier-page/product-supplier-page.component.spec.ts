import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSupplierPageComponent } from './product-supplier-page.component';

describe('ProductSupplierPageComponent', () => {
  let component: ProductSupplierPageComponent;
  let fixture: ComponentFixture<ProductSupplierPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSupplierPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSupplierPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
