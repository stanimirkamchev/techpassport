import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PocMenuComponent } from './poc-menu.component';

describe('PocMenuComponent', () => {
  let component: PocMenuComponent;
  let fixture: ComponentFixture<PocMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PocMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PocMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
