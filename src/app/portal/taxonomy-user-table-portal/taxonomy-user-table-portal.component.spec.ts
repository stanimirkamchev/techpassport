import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxonomyUserTablePortalComponent } from './taxonomy-user-table-portal.component';

describe('TaxonomyUserTablePortalComponent', () => {
  let component: TaxonomyUserTablePortalComponent;
  let fixture: ComponentFixture<TaxonomyUserTablePortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxonomyUserTablePortalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxonomyUserTablePortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
