import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HowtoModalComponent } from './howto-modal.component';

describe('HowtoModalComponent', () => {
  let component: HowtoModalComponent;
  let fixture: ComponentFixture<HowtoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HowtoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowtoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
