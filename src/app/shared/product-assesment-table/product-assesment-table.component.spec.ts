import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAssesmentTableComponent } from './product-assesment-table.component';

describe('ProductAssesmentTableComponent', () => {
  let component: ProductAssesmentTableComponent;
  let fixture: ComponentFixture<ProductAssesmentTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductAssesmentTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAssesmentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
