import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierProductsPageComponent } from './supplier-products-page.component';

describe('SupplierProductsPageComponent', () => {
  let component: SupplierProductsPageComponent;
  let fixture: ComponentFixture<SupplierProductsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierProductsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierProductsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
