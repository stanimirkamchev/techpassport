import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BanksTableComponent } from './banks-table.component';

describe('BanksTableComponent', () => {
  let component: BanksTableComponent;
  let fixture: ComponentFixture<BanksTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BanksTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BanksTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
