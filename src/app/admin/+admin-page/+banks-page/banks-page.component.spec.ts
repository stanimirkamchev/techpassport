import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BanksPageComponent } from './banks-page.component';

describe('BanksPageComponent', () => {
  let component: BanksPageComponent;
  let fixture: ComponentFixture<BanksPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BanksPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BanksPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
