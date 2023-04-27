import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessManagementFiltersComponent } from './access-management-filters.component';

describe('AccessManagementFiltersComponent', () => {
  let component: AccessManagementFiltersComponent;
  let fixture: ComponentFixture<AccessManagementFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessManagementFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessManagementFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
