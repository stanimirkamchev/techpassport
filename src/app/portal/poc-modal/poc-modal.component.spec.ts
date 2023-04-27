import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PocModalComponent } from './poc-modal.component';

describe('PocComponent', () => {
  let component: PocModalComponent;
  let fixture: ComponentFixture<PocModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PocModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PocModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
