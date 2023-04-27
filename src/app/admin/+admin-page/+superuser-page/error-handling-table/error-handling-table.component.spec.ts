import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorHandlingTableComponent } from './error-handling-table.component';

describe('ErrorHandlingTableComponent', () => {
  let component: ErrorHandlingTableComponent;
  let fixture: ComponentFixture<ErrorHandlingTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorHandlingTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorHandlingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
