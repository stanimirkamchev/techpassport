import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsProductFunctionalityComponent } from './details-product-functionality.component';

describe('DetailsProductFunctionalityComponent', () => {
  let component: DetailsProductFunctionalityComponent;
  let fixture: ComponentFixture<DetailsProductFunctionalityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsProductFunctionalityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsProductFunctionalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
