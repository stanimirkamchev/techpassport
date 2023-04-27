import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierRapidProductsComponent } from './supplier-rapid-products.component';

describe('SupplierRapidProductsComponent', () => {
  let component: SupplierRapidProductsComponent;
  let fixture: ComponentFixture<SupplierRapidProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierRapidProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierRapidProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
