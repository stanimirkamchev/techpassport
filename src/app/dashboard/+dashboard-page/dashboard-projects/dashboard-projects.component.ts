import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { DashboardProject } from '../../store/dashboard.model';
import { FormGroup, FormControl } from '@angular/forms';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { filterDebounce } from '@models/filters';
import { Destroyable } from '@abstract/destroyable';
import { Store } from '@ngrx/store';
import { State } from 'src/app/store';
import { filterProducts } from 'src/app/admin/store/product/product.actions';
import { filterProjects, sortProjects } from '../../store/dashboard.actions';
import { Sort } from '@angular/material/sort';
import { createFeedbackLoop } from '../../../feedback/store/feedback.actions';

@Component({
  selector: 'dashboard-projects',
  templateUrl: './dashboard-projects.component.html',
  styleUrls: ['./dashboard-projects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardProjectsComponent extends Destroyable implements OnInit {

  @Input() set projects(projects: DashboardProject[]) {
    this.projectNames = [...new Set((projects || []).map(c => c.name))];
    const pocs = (projects || []).map(p => p.pocs).reduce((acc, val) => acc.concat(val), []);
    this.suppliers = [...new Set((pocs || []).map(c => c.supplier))];
    this.products = [...new Set((pocs || []).map(c => c.product))];
    this._projects = projects;
  }
  @Input() loading: boolean;

  _projects: DashboardProject[];

  projectNames: string[];
  suppliers: string[];
  products: string[];

  formGroup = new FormGroup({
    name: new FormControl(''),
    supplier: new FormControl(''),
    product: new FormControl('')
  });

  displayedColumns = [
    'name',
    'dates',
    'totalSuppliers',
    'totalProducts',
    'duration',
    'pocStatus',
    'connectionStatus'
  ];

  constructor(private store: Store<State>) {
    super();
  }

  ngOnInit() {


    this.formGroup.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .pipe(debounceTime(filterDebounce))
      .subscribe(filters => this.store.dispatch(filterProjects({ filters })));
  }

  sort(sort: Sort) {
    this.store.dispatch(sortProjects({ sort }));
  }

  onFeedbackLoop(projectId: string) {
    this.store.dispatch(createFeedbackLoop({ projectId }));
  }
}
