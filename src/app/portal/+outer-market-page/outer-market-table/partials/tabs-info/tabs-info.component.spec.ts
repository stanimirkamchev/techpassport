import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsInfoComponent } from './tabs-info.component';

describe('TabsInfoComponent', () => {
  let component: TabsInfoComponent;
  let fixture: ComponentFixture<TabsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabsInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
