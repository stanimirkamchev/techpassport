import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertModalPocComponent } from './alert-modal-poc.component';

describe('AlertModalPocComponent', () => {
  let component: AlertModalPocComponent;
  let fixture: ComponentFixture<AlertModalPocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertModalPocComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertModalPocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
