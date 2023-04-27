import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductHostingComponent } from './product-hosting.component';

describe('ChangePasswordComponent', () => {
  let component: ProductHostingComponent;
  let fixture: ComponentFixture<ProductHostingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductHostingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductHostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
