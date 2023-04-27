import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationRequestedComponent } from './information-requested.component';

describe('InformationRequestedComponent', () => {
  let component: InformationRequestedComponent;
  let fixture: ComponentFixture<InformationRequestedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformationRequestedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationRequestedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
