/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CompliancePageComponent } from './compliance-page.component';

describe('CompliancePageComponent', () => {
  let component: CompliancePageComponent;
  let fixture: ComponentFixture<CompliancePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompliancePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompliancePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
