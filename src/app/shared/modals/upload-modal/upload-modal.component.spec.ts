import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpladModalComponent } from './uplad-modal.component';

describe('UpladModalComponent', () => {
  let component: UpladModalComponent;
  let fixture: ComponentFixture<UpladModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpladModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpladModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
