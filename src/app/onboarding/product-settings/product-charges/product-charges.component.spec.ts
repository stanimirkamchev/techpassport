import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductChargesComponent } from './product-charges.component';

describe('UseCasesComponent', () => {
  let component: ProductChargesComponent;
  let fixture: ComponentFixture<ProductChargesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductChargesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
