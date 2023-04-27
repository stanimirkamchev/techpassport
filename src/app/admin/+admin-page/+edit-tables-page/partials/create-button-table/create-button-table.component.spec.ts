import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateButtonTableComponent } from './create-button-table.component';

describe('CreateButtonTableComponent', () => {
  let component: CreateButtonTableComponent;
  let fixture: ComponentFixture<CreateButtonTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateButtonTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateButtonTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
