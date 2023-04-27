import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Sort } from '@angular/material/sort';

import { Customer, CustomersFilters, CustomersBuilder } from './customer.model';
import * as CustomerActions from './customer.actions';
import { TypedAction } from '@ngrx/store/src/models';

export const customersFeatureKey = 'customers';

const selectCustomerId = (customer: Customer) => customer._id;

export interface State extends EntityState<Customer> {
  sort?: Sort;
  loaded: boolean;
  loading: boolean;
  cached: Customer[];
  filters: CustomersFilters;
}

export const adapter: EntityAdapter<Customer> = createEntityAdapter<Customer>({
  selectId: selectCustomerId
});

export const initialState: State = adapter.getInitialState({
  loaded: false,
  loading: false,
  cached: [],
  filters: {}
});

export const reducer = createReducer(
  initialState,
  on(CustomerActions.loadCustomers,
    (state) => ({
      ...state,
      loading: true
    })
  ),
  on(CustomerActions.loadCustomersSuccess,
    (state, action) => ({
      ...adapter.setAll(action.customers, state),
      cached: action.customers,
      loading: false,
      loaded: true
    })
  ),
  on(CustomerActions.loadCustomersError,
    (state) => ({
      ...state,
      loading: false,
      loaded: false
    })
  ),
  on(
    CustomerActions.sortCustomers,
    CustomerActions.filterCustomers,
    (state, action) => {
      const customers = new CustomersBuilder(state.cached)
        .filter(isFilterType(action) ? action.filters : state.filters)
        .sort(isFilterType(action) ? state.sort : action.sort)
        .get();
      return {
        ...state,
        ...adapter.setAll(customers, state),
        sort: isFilterType(action) ? state.sort : action.sort,
        filters: isFilterType(action) ? action.filters : state.filters
      };
    }
  ),
  on(
    CustomerActions.changeCustomerSaml,
    (state, action) => {
      const updateCustomers = state.cached.map(customer => action.id === customer._id ? action.customer : customer);
        return {
          ...state,
          cached: updateCustomers,
        };
    }
  ),
);

const isFilterType = (action): action is TypedAction<'[Customer/API] Filter Customers'> => {
  return !action.sort;
};

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
