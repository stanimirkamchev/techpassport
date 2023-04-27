import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDiversityComponent } from './company-diversity.component';

describe('CompanyDiversityComponent', () => {
  let component: CompanyDiversityComponent;
  let fixture: ComponentFixture<CompanyDiversityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyDiversityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDiversityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
