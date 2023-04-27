import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestUpdateModalComponent } from './request-update-modal.component';

describe('RequestUpdateModalComponent', () => {
  let component: RequestUpdateModalComponent;
  let fixture: ComponentFixture<RequestUpdateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestUpdateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
