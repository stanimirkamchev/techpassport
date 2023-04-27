import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {Sort} from '@angular/material/sort';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {switchMap, tap, filter, take} from 'rxjs/operators';

import {Compliance, ComplianceFilters} from '../../store/compliance/compliance.model';
import {
  selectComplianceLoaded, selectCompliances, selectComplianceFilters, selectComplianceSort,
  selectComplianceLoading, selectCachedCompliances
} from '../../store/compliance/compliance.selector';
import {loadCompliances, sortCompliances, filterCompliances, downloadCompliances} from '../../store/compliance/compliance.actions';
import {State} from '../../store/compliance/compliance.reducer';

@Component({
  selector: 'app-compliance-page',
  templateUrl: './compliance-page.component.html',
  styleUrls: ['./compliance-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompliancePageComponent implements OnInit {

  filters$: Observable<ComplianceFilters>;
  sort$: Observable<Sort>;
  compliances$: Observable<Compliance[]>;
  cachedCompliances$: Observable<Compliance[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store<State>) {}

  ngOnInit() {
    this.sort$ = this.store.select(selectComplianceSort);
    this.loading$ = this.store.select(selectComplianceLoading);
    this.filters$ = this.store.select(selectComplianceFilters);
    this.cachedCompliances$ = this.store.select(selectCachedCompliances);
    this.compliances$ = this.store.select(selectComplianceLoaded)
      .pipe(take(1), tap(loaded => !loaded && this.store.dispatch(loadCompliances())))
      .pipe(filter(loaded => !!loaded))
      .pipe(switchMap(_ => this.store.select(selectCompliances)));
  }

  onSort(sort: Sort) {
    this.store.dispatch(sortCompliances({sort}));
  }

  onFilter(filters: ComplianceFilters) {
    this.store.dispatch(filterCompliances({filters}));
  }

  download(compliances: Compliance[]) {
    this.store.dispatch(downloadCompliances({compliances}));
  }
}
