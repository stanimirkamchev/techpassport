import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSupplierListComponent } from './new-supplier-list.component';

describe('NewSupplierListComponent', () => {
  let component: NewSupplierListComponent;
  let fixture: ComponentFixture<NewSupplierListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSupplierListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSupplierListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
