import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsProductHostingComponent } from './details-product-hosting.component';

describe('DetailsProductHostingComponent', () => {
  let component: DetailsProductHostingComponent;
  let fixture: ComponentFixture<DetailsProductHostingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsProductHostingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsProductHostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
