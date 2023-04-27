import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceModalComponent } from './compliance-modal.component';

describe('ComplianceModalComponent', () => {
  let component: ComplianceModalComponent;
  let fixture: ComponentFixture<ComplianceModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplianceModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
