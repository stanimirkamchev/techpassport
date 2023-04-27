import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceProductPageComponent } from './compliance-product-page.component';

describe('ComplianceProductPageComponent', () => {
  let component: ComplianceProductPageComponent;
  let fixture: ComponentFixture<ComplianceProductPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplianceProductPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceProductPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
