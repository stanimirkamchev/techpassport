import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsProductChargesComponent } from './details-product-charges.component';

describe('DetailsProductChargesComponent', () => {
  let component: DetailsProductChargesComponent;
  let fixture: ComponentFixture<DetailsProductChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsProductChargesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsProductChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
