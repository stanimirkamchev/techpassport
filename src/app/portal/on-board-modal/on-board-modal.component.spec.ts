import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnBoardModalComponent } from './on-board-modal.component';

describe('OnBoardModalComponent', () => {
  let component: OnBoardModalComponent;
  let fixture: ComponentFixture<OnBoardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnBoardModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnBoardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
