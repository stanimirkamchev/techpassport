import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteSentModalComponent } from './invite-sent-modal.component';

describe('RemoveWatchlistsModalComponent', () => {
  let component: InviteSentModalComponent;
  let fixture: ComponentFixture<InviteSentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteSentModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteSentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
