import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiHeaderComponent } from './ui-header.component';

describe('UiMenuComponent', () => {
  let component: UiHeaderComponent;
  let fixture: ComponentFixture<UiHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
