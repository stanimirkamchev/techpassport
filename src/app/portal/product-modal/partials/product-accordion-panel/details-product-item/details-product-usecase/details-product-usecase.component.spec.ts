import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsProductUsecaseComponent } from './details-product-usecase.component';

describe('DetailsProductUsecaseComponent', () => {
  let component: DetailsProductUsecaseComponent;
  let fixture: ComponentFixture<DetailsProductUsecaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsProductUsecaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsProductUsecaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
