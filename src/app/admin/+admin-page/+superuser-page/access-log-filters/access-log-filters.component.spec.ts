import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessLogFiltersComponent } from './access-log-filters.component';

describe('AccessLogFiltersComponent', () => {
  let component: AccessLogFiltersComponent;
  let fixture: ComponentFixture<AccessLogFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessLogFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessLogFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
