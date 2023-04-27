import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErqProductItemComponent } from './erq-product-item.component';

describe('ErqProductItemComponent', () => {
  let component: ErqProductItemComponent;
  let fixture: ComponentFixture<ErqProductItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErqProductItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErqProductItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
