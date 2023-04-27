import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUserTablePortalComponent } from './update-user-table-portal.component';

describe('UpdateUserTablePortalComponent', () => {
  let component: UpdateUserTablePortalComponent;
  let fixture: ComponentFixture<UpdateUserTablePortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateUserTablePortalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateUserTablePortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
