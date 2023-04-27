import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceReviewPageComponent } from './compliance-review-page.component';

describe('ComplianceReviewPageComponent', () => {
  let component: ComplianceReviewPageComponent;
  let fixture: ComponentFixture<ComplianceReviewPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplianceReviewPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceReviewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
