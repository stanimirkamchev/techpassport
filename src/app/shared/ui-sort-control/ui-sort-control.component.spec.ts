import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSortControlComponent } from './ui-sort-control.component';

describe('UiSortControlComponent', () => {
  let component: UiSortControlComponent;
  let fixture: ComponentFixture<UiSortControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiSortControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiSortControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
