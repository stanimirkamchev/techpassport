import { createAction, props } from '@ngrx/store';
import { Sort } from '@angular/material/sort';

import { Customer, CustomersFilters } from './customer.model';

// loadCustomers
export const loadCustomers = createAction(
  '[Customer/API] Load Customers'
);

export const loadCustomersSuccess = createAction(
  '[Customer/API] Load Customers Success',
  props<{ customers: Customer[] }>()
);

export const loadCustomersSuccessSSO = createAction(
  '[Customer/API] Load Customers Success SSO',
  props<{ customers: Customer[] }>()
);

export const loadCustomersError = createAction(
  '[Customer/API] Load Customers Error',
  props<{ error: any }>()
);


// editCustomer
export const editCustomer = createAction(
  '[Customer/API] Edit Customer',
  props<{ id: string }>()
);

// change Customer Saml
export const changeCustomerSaml = createAction(
  '[Customer/API] Change Customer SAML',
  props<{ id: string, customer: Customer  }>()
);

// filterCustomers sortCustomers
export const filterCustomers = createAction(
  '[Customer/API] Filter Customers',
  props<{ filters: CustomersFilters }>()
);

export const sortCustomers = createAction(
  '[Customer/API] Sort Customers',
  props<{ sort: Sort }>()
);
