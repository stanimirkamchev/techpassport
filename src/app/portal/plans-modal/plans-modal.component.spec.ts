import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlansModalComponent } from './plans-modal.component';

describe('PlansModalComponent', () => {
  let component: PlansModalComponent;
  let fixture: ComponentFixture<PlansModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlansModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlansModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
