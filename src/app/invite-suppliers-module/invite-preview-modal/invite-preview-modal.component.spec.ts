import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitePreviewModalComponent } from './invite-preview-modal.component';

describe('InvitePreviewModalComponent', () => {
  let component: InvitePreviewModalComponent;
  let fixture: ComponentFixture<InvitePreviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitePreviewModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitePreviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
