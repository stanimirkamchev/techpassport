import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TppNoteModalComponent } from './tpp-note-modal.component';

describe('TppNoteModalComponent', () => {
  let component: TppNoteModalComponent;
  let fixture: ComponentFixture<TppNoteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TppNoteModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TppNoteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
