import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectmeModalComponent } from './connectme-modal.component';

describe('ConnectmeModalComponent', () => {
  let component: ConnectmeModalComponent;
  let fixture: ComponentFixture<ConnectmeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectmeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectmeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
