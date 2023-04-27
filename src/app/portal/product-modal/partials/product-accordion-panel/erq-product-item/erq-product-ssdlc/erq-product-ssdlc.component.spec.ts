import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErqProductSsdlcComponent } from './erq-product-ssdlc.component';

describe('ErqProductSsdlcComponent', () => {
  let component: ErqProductSsdlcComponent;
  let fixture: ComponentFixture<ErqProductSsdlcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErqProductSsdlcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErqProductSsdlcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
