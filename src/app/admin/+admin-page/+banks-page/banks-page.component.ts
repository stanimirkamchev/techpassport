import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Sort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { take, tap, filter, switchMap } from 'rxjs/operators';

import { Customer, CustomersFilters } from '../../store/customer/customer.model';
import { loadCustomers, sortCustomers, filterCustomers, editCustomer } from '../../store/customer/customer.actions';
import { selectCachedCustomers, selectCustomersFilters, selectCustomersLoading, selectCustomers, selectCustomersLoaded } from '../../store/customer/customer.selector';
import { State } from '../../store';
import * as fromBuyer from 'src/app/onboarding/store/buyer/buyer.actions';
import { changeCustomerSaml } from 'src/app/admin/store/customer/customer.actions';
import {PopUpService} from '../../../shared/pop-up-service';

type samlType = {
  event: any, // Event
  element: Customer
};

@Component({
  templateUrl: './banks-page.component.html',
  styleUrls: ['./banks-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BanksPageComponent implements OnInit {

  customers$: Observable<Customer[]>;
  filters$: Observable<CustomersFilters>;
  loading$: Observable<boolean>;
  cachedCustomers$: Observable<Customer[]>;

  constructor(
    private store: Store<State>,
    private popUpService: PopUpService,
    private router: Router) { }

  ngOnInit() {
    this.popUpService.popUpOverview.subscribe(data => {
      this.loading$ = this.store.select(selectCustomersLoading);
      this.store.dispatch(loadCustomers())
    })
    this.cachedCustomers$ = this.store.select(selectCachedCustomers);
    this.filters$ = this.store.select(selectCustomersFilters);
    this.loading$ = this.store.select(selectCustomersLoading);
    this.customers$ = this.store.select(selectCustomersLoaded)
      .pipe(take(1), tap(loaded => !loaded && this.store.dispatch(loadCustomers())))
      .pipe(filter(loaded => !!loaded))
      .pipe(switchMap(_ => this.store.select(selectCustomers)));
  }

  openCustomer(customer: Customer) {
    this.router.navigate([`/admin/customers/${customer._id}`]);
  }

  onSort(sort: Sort) {
    this.store.dispatch(sortCustomers({ sort }));
  }

  onEdit({ _id: id }: Customer) {
    this.store.dispatch(fromBuyer.editBuyer({ id }));
  }

  onChangeSaml({ event, element }: samlType) {
    const id = element._id;
    const customer = { ...element, isSamlAuthenticated: element.isSamlAuthenticated ? event.checked : false };
    this.store.dispatch(changeCustomerSaml({ id, customer }));
  }

  onFilter(filters: CustomersFilters) {
    this.store.dispatch(filterCustomers({ filters }));
  }
}
