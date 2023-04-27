import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyInsuranceComponent } from './company-insurance.component';

describe('UseCasesComponent', () => {
  let component: CompanyInsuranceComponent;
  let fixture: ComponentFixture<CompanyInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyInsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
