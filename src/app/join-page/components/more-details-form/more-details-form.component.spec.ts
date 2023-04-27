import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreDetailsFormComponent } from './more-details-form.component';

describe('MoreDetailsFormComponent', () => {
  let component: MoreDetailsFormComponent;
  let fixture: ComponentFixture<MoreDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoreDetailsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
