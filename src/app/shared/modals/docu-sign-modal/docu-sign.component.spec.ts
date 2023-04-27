import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocuSignComponent } from './docu-sign.component';

describe('DocuSignComponent', () => {
  let component: DocuSignComponent;
  let fixture: ComponentFixture<DocuSignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocuSignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocuSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
