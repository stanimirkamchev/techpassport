import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationPanelPageComponent } from './invitation-panel-page.component';

describe('InvitationPanelPageComponent', () => {
  let component: InvitationPanelPageComponent;
  let fixture: ComponentFixture<InvitationPanelPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitationPanelPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationPanelPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
