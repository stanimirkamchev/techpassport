import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErqProductPrivacyComponent } from './erq-product-privacy.component';

describe('ErqProductPrivacyComponent', () => {
  let component: ErqProductPrivacyComponent;
  let fixture: ComponentFixture<ErqProductPrivacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErqProductPrivacyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErqProductPrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
