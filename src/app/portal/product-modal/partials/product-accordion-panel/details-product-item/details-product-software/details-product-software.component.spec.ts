import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsProductSoftwareComponent } from './details-product-software.component';

describe('DetailsProductSoftwareComponent', () => {
  let component: DetailsProductSoftwareComponent;
  let fixture: ComponentFixture<DetailsProductSoftwareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsProductSoftwareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsProductSoftwareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
