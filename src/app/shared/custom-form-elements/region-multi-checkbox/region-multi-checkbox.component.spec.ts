import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionMultiCheckboxComponent } from './region-multi-checkbox.component';

describe('RegionMultiCheckboxComponent', () => {
  let component: RegionMultiCheckboxComponent;
  let fixture: ComponentFixture<RegionMultiCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegionMultiCheckboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionMultiCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
