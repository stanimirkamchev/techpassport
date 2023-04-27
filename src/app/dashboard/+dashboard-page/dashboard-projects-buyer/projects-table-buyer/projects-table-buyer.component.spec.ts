import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsTableBuyerComponent } from './projects-table-buyer.component';

describe('ProjectsTableBuyerComponent', () => {
  let component: ProjectsTableBuyerComponent;
  let fixture: ComponentFixture<ProjectsTableBuyerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectsTableBuyerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsTableBuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
