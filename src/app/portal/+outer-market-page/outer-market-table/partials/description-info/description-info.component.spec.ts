import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionInfoComponent } from './description-info.component';

describe('DescriptionInfoComponent', () => {
  let component: DescriptionInfoComponent;
  let fixture: ComponentFixture<DescriptionInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescriptionInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
