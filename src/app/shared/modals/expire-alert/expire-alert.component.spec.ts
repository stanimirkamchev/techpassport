import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpireAlertComponent } from './expire-alert.component';

describe('ExpireAlertComponent', () => {
  let component: ExpireAlertComponent;
  let fixture: ComponentFixture<ExpireAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpireAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpireAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
