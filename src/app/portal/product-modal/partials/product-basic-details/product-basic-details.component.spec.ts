import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBasicDetailsComponent } from './product-basic-details.component';

describe('ProductBasicDetailsComponent', () => {
  let component: ProductBasicDetailsComponent;
  let fixture: ComponentFixture<ProductBasicDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductBasicDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBasicDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
