import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchesPreviewComponent } from './searches-preview.component';

describe('SearchesPreviewComponent', () => {
  let component: SearchesPreviewComponent;
  let fixture: ComponentFixture<SearchesPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchesPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchesPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
