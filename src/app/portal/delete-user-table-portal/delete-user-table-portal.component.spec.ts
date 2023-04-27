import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUserTablePortalComponent } from './delete-user-table-portal.component';

describe('DeleteUserTablePortalComponent', () => {
  let component: DeleteUserTablePortalComponent;
  let fixture: ComponentFixture<DeleteUserTablePortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteUserTablePortalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteUserTablePortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
