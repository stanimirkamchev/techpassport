import { createSelector } from '@ngrx/store';
import { selectAdminState } from '..';
import * as fromCustomer from './customer.reducer';

export const selectCustomerState = createSelector(
  selectAdminState,
  state => state[fromCustomer.customersFeatureKey]
);

export const selectCustomers = createSelector(
  selectCustomerState,
  fromCustomer.selectAll
);

export const selectCustomersLoading = createSelector(
  selectCustomerState,
  state => state.loading
);

export const selectCustomersLoaded = createSelector(
  selectCustomerState,
  state => state.loaded
);

export const selectCachedCustomers = createSelector(
  selectCustomerState,
  state => state.cached
);

export const selectCustomersFilters = createSelector(
  selectCustomerState,
  state => state.filters
);
