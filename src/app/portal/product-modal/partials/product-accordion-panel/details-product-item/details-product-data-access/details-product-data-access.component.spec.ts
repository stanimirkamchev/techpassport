import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsProductDataAccessComponent } from './details-product-data-access.component';

describe('DetailsProductDataAccessComponent', () => {
  let component: DetailsProductDataAccessComponent;
  let fixture: ComponentFixture<DetailsProductDataAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsProductDataAccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsProductDataAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
