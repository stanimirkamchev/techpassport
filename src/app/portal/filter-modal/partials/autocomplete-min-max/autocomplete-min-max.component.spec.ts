import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteMinMaxComponent } from './autocomplete-min-max.component';

describe('AutocompleteMinMaxComponent', () => {
  let component: AutocompleteMinMaxComponent;
  let fixture: ComponentFixture<AutocompleteMinMaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutocompleteMinMaxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteMinMaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
