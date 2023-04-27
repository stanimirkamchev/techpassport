import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FisworkedComponent } from './fisworked.component';

describe('FisworkedComponent', () => {
  let component: FisworkedComponent;
  let fixture: ComponentFixture<FisworkedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FisworkedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FisworkedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
