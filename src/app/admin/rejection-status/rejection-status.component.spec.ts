import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectionStatusComponent } from './rejection-status.component';

describe('RejectionStatusComponent', () => {
  let component: RejectionStatusComponent;
  let fixture: ComponentFixture<RejectionStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectionStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectionStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
