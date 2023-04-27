import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCollateralComponent } from './product-collateral.component';

describe('ChangePasswordComponent', () => {
  let component: ProductCollateralComponent;
  let fixture: ComponentFixture<ProductCollateralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductCollateralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCollateralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
