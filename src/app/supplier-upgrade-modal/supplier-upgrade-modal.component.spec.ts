import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierUpgradeModalComponent } from './supplier-upgrade-modal.component';

describe('SupplierUpgradeModalComponent', () => {
  let component: SupplierUpgradeModalComponent;
  let fixture: ComponentFixture<SupplierUpgradeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierUpgradeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierUpgradeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
