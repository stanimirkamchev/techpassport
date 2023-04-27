import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSuccessModalComponent } from './create-success-modal.component';

describe('RemoveWatchlistsModalComponent', () => {
  let component: CreateSuccessModalComponent;
  let fixture: ComponentFixture<CreateSuccessModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSuccessModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSuccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
