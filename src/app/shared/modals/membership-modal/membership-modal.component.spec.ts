import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipModalComponent } from './membership-modal.component';

describe('MembershipModalComponent', () => {
  let component: MembershipModalComponent;
  let fixture: ComponentFixture<MembershipModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MembershipModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
