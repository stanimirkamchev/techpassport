import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiPageContentComponent } from './ui-page-content.component';

describe('UiPageContentComponent', () => {
  let component: UiPageContentComponent;
  let fixture: ComponentFixture<UiPageContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiPageContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiPageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
