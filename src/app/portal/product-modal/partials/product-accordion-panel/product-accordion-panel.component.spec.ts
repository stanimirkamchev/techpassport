import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAccordionPanelComponent } from './product-accordion-panel.component';

describe('ProductAccordionPanelComponent', () => {
  let component: ProductAccordionPanelComponent;
  let fixture: ComponentFixture<ProductAccordionPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductAccordionPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAccordionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
