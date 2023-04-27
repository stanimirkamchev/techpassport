import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisabledUserPortalComponent } from './disabled-user-portal.component';

describe('DisabledUserPortalComponent', () => {
  let component: DisabledUserPortalComponent;
  let fixture: ComponentFixture<DisabledUserPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisabledUserPortalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisabledUserPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
