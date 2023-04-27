import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceAssessmentListComponent } from './compliance-assessment-list.component';

describe('ComplianceAssessmentListComponent', () => {
  let component: ComplianceAssessmentListComponent;
  let fixture: ComponentFixture<ComplianceAssessmentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplianceAssessmentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceAssessmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
