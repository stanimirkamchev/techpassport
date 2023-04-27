import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErqProductDeletionComponent } from './erq-product-deletion.component';

describe('ErqProductDeletionComponent', () => {
  let component: ErqProductDeletionComponent;
  let fixture: ComponentFixture<ErqProductDeletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErqProductDeletionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErqProductDeletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
