import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceLayoutComponent } from './marketplace-layout.component';

describe('MarketplaceLayoutComponent', () => {
  let component: MarketplaceLayoutComponent;
  let fixture: ComponentFixture<MarketplaceLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketplaceLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
