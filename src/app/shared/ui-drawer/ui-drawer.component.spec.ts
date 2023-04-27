import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiDrawerComponent } from './ui-drawer.component';

describe('UiDrawerComponent', () => {
  let component: UiDrawerComponent;
  let fixture: ComponentFixture<UiDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
