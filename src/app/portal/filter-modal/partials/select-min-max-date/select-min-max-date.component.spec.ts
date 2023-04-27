import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMinMaxDateComponent } from './select-min-max-date.component';

describe('SelectMinMaxDateComponent', () => {
  let component: SelectMinMaxDateComponent;
  let fixture: ComponentFixture<SelectMinMaxDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectMinMaxDateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMinMaxDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
