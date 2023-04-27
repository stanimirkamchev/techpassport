import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PocTeamManagerComponent } from './poc-team-manager.component';

describe('PocTeamManagerComponent', () => {
  let component: PocTeamManagerComponent;
  let fixture: ComponentFixture<PocTeamManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PocTeamManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PocTeamManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
