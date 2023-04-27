import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceTableComponent } from './compliance-table.component';

describe('ComplianceTableComponent', () => {
  let component: ComplianceTableComponent;
  let fixture: ComponentFixture<ComplianceTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplianceTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
