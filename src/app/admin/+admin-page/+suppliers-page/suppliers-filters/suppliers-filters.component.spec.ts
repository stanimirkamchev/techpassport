import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliersFiltersComponent } from './suppliers-filters.component';

describe('SuppliersFiltersComponent', () => {
  let component: SuppliersFiltersComponent;
  let fixture: ComponentFixture<SuppliersFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuppliersFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuppliersFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
