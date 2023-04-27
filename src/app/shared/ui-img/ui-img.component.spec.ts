import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiImgComponent } from './ui-img.component';

describe('UiImgComponent', () => {
  let component: UiImgComponent;
  let fixture: ComponentFixture<UiImgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiImgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
