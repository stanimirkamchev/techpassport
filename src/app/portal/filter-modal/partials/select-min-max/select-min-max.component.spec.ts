import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMinMaxComponent } from './select-min-max.component';

describe('SelectMinMaxComponent', () => {
  let component: SelectMinMaxComponent;
  let fixture: ComponentFixture<SelectMinMaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectMinMaxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMinMaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
