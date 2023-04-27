import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackBarCustomComponent } from './snack-bar-custom.component';

describe('SnackBarCustomComponent', () => {
  let component: SnackBarCustomComponent;
  let fixture: ComponentFixture<SnackBarCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnackBarCustomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackBarCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
