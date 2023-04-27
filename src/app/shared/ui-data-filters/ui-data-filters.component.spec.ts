import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiDataFiltersComponent } from './ui-data-filters.component';

describe('UiDataFiltersComponent', () => {
  let component: UiDataFiltersComponent;
  let fixture: ComponentFixture<UiDataFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiDataFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiDataFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
