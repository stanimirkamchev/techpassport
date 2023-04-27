import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipFileDropzoneComponent } from './membership-file-dropzone.component';

describe('MembershipFileDropzoneComponent', () => {
  let component: MembershipFileDropzoneComponent;
  let fixture: ComponentFixture<MembershipFileDropzoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MembershipFileDropzoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipFileDropzoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
