import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErqProductSecurityComponent } from './erq-product-security.component';

describe('ErqProductSecurityComponent', () => {
  let component: ErqProductSecurityComponent;
  let fixture: ComponentFixture<ErqProductSecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErqProductSecurityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErqProductSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
