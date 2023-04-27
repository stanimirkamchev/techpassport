import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBusinessGroupComponentComponent } from './add-business-group-component.component';

describe('AddBusinessGroupComponentComponent', () => {
  let component: AddBusinessGroupComponentComponent;
  let fixture: ComponentFixture<AddBusinessGroupComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBusinessGroupComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBusinessGroupComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
