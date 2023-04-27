import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceFiltersComponent } from './compliance-filters.component';

describe('ComplianceFiltersComponent', () => {
  let component: ComplianceFiltersComponent;
  let fixture: ComponentFixture<ComplianceFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplianceFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
