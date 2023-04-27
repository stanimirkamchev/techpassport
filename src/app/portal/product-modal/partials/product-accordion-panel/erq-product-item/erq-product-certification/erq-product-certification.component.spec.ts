import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErqProductCertificationComponent } from './erq-product-certification.component';

describe('ErqProductCertificationComponent', () => {
  let component: ErqProductCertificationComponent;
  let fixture: ComponentFixture<ErqProductCertificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErqProductCertificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErqProductCertificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
