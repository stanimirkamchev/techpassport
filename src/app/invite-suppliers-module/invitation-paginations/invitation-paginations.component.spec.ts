import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationPaginationsComponent } from './invitation-paginations.component';

describe('InvitationPaginationsComponent', () => {
  let component: InvitationPaginationsComponent;
  let fixture: ComponentFixture<InvitationPaginationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitationPaginationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationPaginationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
