import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomMultiCheckboxComponent } from './custom-multi-checkbox.component';

describe('CustomMultiCheckboxComponent', () => {
  let component: CustomMultiCheckboxComponent;
  let fixture: ComponentFixture<CustomMultiCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomMultiCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomMultiCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
