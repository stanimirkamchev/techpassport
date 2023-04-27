import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceAssessmentItemComponent } from './compliance-assessment-item.component';

describe('ComplianceAssessmentItemComponent', () => {
  let component: ComplianceAssessmentItemComponent;
  let fixture: ComponentFixture<ComplianceAssessmentItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplianceAssessmentItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceAssessmentItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
