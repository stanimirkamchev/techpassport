import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiPageCloseComponent } from './ui-page-close.component';

describe('UiPageCloseComponent', () => {
  let component: UiPageCloseComponent;
  let fixture: ComponentFixture<UiPageCloseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiPageCloseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiPageCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
