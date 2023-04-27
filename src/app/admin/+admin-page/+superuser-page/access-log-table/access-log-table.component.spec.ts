import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessLogTableComponent } from './access-log-table.component';

describe('AccessLogTableComponent', () => {
  let component: AccessLogTableComponent;
  let fixture: ComponentFixture<AccessLogTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessLogTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessLogTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
