import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperuserPageComponent } from './superuser-page.component';

describe('SuperuserPageComponent', () => {
  let component: SuperuserPageComponent;
  let fixture: ComponentFixture<SuperuserPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperuserPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperuserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
