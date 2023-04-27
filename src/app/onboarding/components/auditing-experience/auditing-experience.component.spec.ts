import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditingExperienceComponent } from './auditing-experience.component';

describe('AuditingExperienceComponent', () => {
  let component: AuditingExperienceComponent;
  let fixture: ComponentFixture<AuditingExperienceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditingExperienceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditingExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
