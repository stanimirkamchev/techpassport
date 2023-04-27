import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErqProductEncryptionComponent } from './erq-product-encryption.component';

describe('ErqProductEncryptionComponent', () => {
  let component: ErqProductEncryptionComponent;
  let fixture: ComponentFixture<ErqProductEncryptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErqProductEncryptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErqProductEncryptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
