import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteModalNewComponent } from './invite-modal-new.component';

describe('InviteModalNewComponent', () => {
  let component: InviteModalNewComponent;
  let fixture: ComponentFixture<InviteModalNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteModalNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteModalNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
