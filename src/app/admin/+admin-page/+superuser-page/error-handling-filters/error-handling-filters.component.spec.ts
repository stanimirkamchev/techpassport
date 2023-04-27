import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorHandlingFiltersComponent } from './error-handling-filters.component';

describe('ErrorHandlingFiltersComponent', () => {
  let component: ErrorHandlingFiltersComponent;
  let fixture: ComponentFixture<ErrorHandlingFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorHandlingFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorHandlingFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
