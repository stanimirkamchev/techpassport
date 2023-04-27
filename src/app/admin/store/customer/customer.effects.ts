import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import * as fromCustomer from './customer.actions';
import { ApiService } from '@services/api/api.service';

@Injectable()
export class CustomerEffects {

  loadCustomers$ = createEffect(() => this.actions$
    .pipe(ofType(fromCustomer.loadCustomers))
    .pipe(switchMap(() => this.apiService.adminGetCustomers()
      .pipe(map(customers => fromCustomer.loadCustomersSuccess({ customers })))
      .pipe(catchError(error => of(fromCustomer.loadCustomersError({ error }))))
    )));

  changeCustomerSaml$ = createEffect(() => this.actions$
    .pipe(ofType(fromCustomer.changeCustomerSaml))
    .pipe(switchMap(({ customer, id }) => this.apiService.adminUpdateCustomerSAML(id, {isSamlAuthenticated: customer.isSamlAuthenticated})
      .pipe(map((customers) => fromCustomer.loadCustomersSuccessSSO({customers})))
      .pipe(catchError(error => of(fromCustomer.loadCustomersError({ error }))))
    )));

  constructor(
    private actions$: Actions,
    private apiService: ApiService) { }
}
