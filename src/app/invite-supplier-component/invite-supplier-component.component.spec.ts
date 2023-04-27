import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteSupplierComponentComponent } from './invite-supplier-component.component';

describe('InviteSupplierComponentComponent', () => {
  let component: InviteSupplierComponentComponent;
  let fixture: ComponentFixture<InviteSupplierComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteSupplierComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteSupplierComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
