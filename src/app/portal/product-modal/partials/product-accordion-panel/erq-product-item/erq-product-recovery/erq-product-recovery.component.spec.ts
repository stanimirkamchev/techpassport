import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErqProductRecoveryComponent } from './erq-product-recovery.component';

describe('ErqProductRecoveryComponent', () => {
  let component: ErqProductRecoveryComponent;
  let fixture: ComponentFixture<ErqProductRecoveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErqProductRecoveryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErqProductRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
