import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErqOverviewComponent } from './erq-overview.component';

describe('ErqOverviewComponent', () => {
  let component: ErqOverviewComponent;
  let fixture: ComponentFixture<ErqOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErqOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErqOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
