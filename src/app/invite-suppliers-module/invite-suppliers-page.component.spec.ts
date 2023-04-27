import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteSuppliersPageComponent } from './invite-suppliers-page.component';

describe('InviteSuppliersPageComponent', () => {
  let component: InviteSuppliersPageComponent;
  let fixture: ComponentFixture<InviteSuppliersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteSuppliersPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteSuppliersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
