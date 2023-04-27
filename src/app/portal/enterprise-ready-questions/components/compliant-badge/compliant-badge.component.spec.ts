import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompliantBadgeComponent } from './compliant-badge.component';

describe('CompliantBadgeComponent', () => {
  let component: CompliantBadgeComponent;
  let fixture: ComponentFixture<CompliantBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompliantBadgeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompliantBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
