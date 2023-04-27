import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationFiltersComponent } from './invitation-filters.component';

describe('InvitationFiltersComponent', () => {
  let component: InvitationFiltersComponent;
  let fixture: ComponentFixture<InvitationFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitationFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
