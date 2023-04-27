import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalPageComponent } from './portal.component';

describe('PortalPageComponent', () => {
  let component: PortalPageComponent;
  let fixture: ComponentFixture<PortalPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortalPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
