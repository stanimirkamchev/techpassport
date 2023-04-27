import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationSoftwareComponent } from './application-software.component';

describe('ChangePasswordComponent', () => {
  let component: ApplicationSoftwareComponent;
  let fixture: ComponentFixture<ApplicationSoftwareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationSoftwareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationSoftwareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
