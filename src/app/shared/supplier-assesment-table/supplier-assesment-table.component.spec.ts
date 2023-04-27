import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierAssesmentTableComponent } from './supplier-assesment-table.component';

describe('SupplierAssesmentTableComponent', () => {
  let component: SupplierAssesmentTableComponent;
  let fixture: ComponentFixture<SupplierAssesmentTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierAssesmentTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierAssesmentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
