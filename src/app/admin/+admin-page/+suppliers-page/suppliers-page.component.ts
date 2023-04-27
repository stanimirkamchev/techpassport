import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../store';
import { Observable } from 'rxjs';
import { Supplier, SuppliersFilters } from '../../store/supplier/supplier.model';
import { filter, tap, switchMap, take } from 'rxjs/operators';

import {
  selectSuppliers, selectSupplierLoaded, selectCachedSuppliers,
  selectSupplierLoading, selectSuppliersFilters
} from '../../store/supplier/supplier.selector';
import { loadSuppliers, sortSuppliers, filterSuppliers, downloadSuppliers } from '../../store/supplier/supplier.actions';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-suppliers-page',
  templateUrl: './suppliers-page.component.html',
  styleUrls: ['./suppliers-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuppliersPageComponent implements OnInit {

  suppliers$: Observable<Supplier[]>;
  filters$: Observable<SuppliersFilters>;
  loading$: Observable<boolean>;
  cachedSuppliers$: Observable<Supplier[]>;
  showInvitationScreen = false;
  constructor(private store: Store<State>) { }

  ngOnInit() {
    this.cachedSuppliers$ = this.store.select(selectCachedSuppliers);
    this.filters$ = this.store.select(selectSuppliersFilters);
    this.loading$ = this.store.select(selectSupplierLoading);
    this.suppliers$ = this.store.select(selectSupplierLoaded)
      .pipe(take(1), tap(loaded => !loaded && this.store.dispatch(loadSuppliers())))
      .pipe(filter(loaded => !!loaded))
      .pipe(switchMap(_ => this.store.select(selectSuppliers)));
  }

  onSort(sort: Sort) {
    this.store.dispatch(sortSuppliers({ sort }));
  }

  onFilter(filters: SuppliersFilters) {
    this.store.dispatch(filterSuppliers({ filters }));
  }

  download(suppliers: Supplier[]) {
    this.store.dispatch(downloadSuppliers({ suppliers }));
  }

  onViewInvitations() {
    this.showInvitationScreen = !this.showInvitationScreen;
  }
}
