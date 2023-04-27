import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErqProductStorageComponent } from './erq-product-storage.component';

describe('ErqProductStorageComponent', () => {
  let component: ErqProductStorageComponent;
  let fixture: ComponentFixture<ErqProductStorageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErqProductStorageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErqProductStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
