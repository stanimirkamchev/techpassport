import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessManagementTableComponent } from './access-management-table.component';

describe('AccessManagementTableComponent', () => {
  let component: AccessManagementTableComponent;
  let fixture: ComponentFixture<AccessManagementTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessManagementTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessManagementTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
