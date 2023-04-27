import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTypeModalComponent } from './user-type-modal.component';

describe('UserTypeModalComponent', () => {
  let component: UserTypeModalComponent;
  let fixture: ComponentFixture<UserTypeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTypeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
