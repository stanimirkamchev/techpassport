import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErqProductBreachComponent } from './erq-product-breach.component';

describe('ErqProductBreachComponent', () => {
  let component: ErqProductBreachComponent;
  let fixture: ComponentFixture<ErqProductBreachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErqProductBreachComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErqProductBreachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
