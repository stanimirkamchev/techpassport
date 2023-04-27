import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierMembershipComponent } from './supplier-membership.component';

describe('SupplierMembershipComponent', () => {
  let component: SupplierMembershipComponent;
  let fixture: ComponentFixture<SupplierMembershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierMembershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
