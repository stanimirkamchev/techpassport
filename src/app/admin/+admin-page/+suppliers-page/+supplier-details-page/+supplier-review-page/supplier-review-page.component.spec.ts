import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierReviewPageComponent } from './supplier-review-page.component';

describe('SupplierReviewPageComponent', () => {
  let component: SupplierReviewPageComponent;
  let fixture: ComponentFixture<SupplierReviewPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierReviewPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierReviewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
