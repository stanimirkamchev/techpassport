import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FISModalComponent } from './FIS-modal.component';

describe('FISModalComponent', () => {
  let component: FISModalComponent;
  let fixture: ComponentFixture<FISModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FISModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FISModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
