import { ActionReducerMap, createFeatureSelector, MetaReducer } from '@ngrx/store';
import { InjectionToken } from '@angular/core';

import { environment } from '../../../environments/environment';
import * as fromSupplier from './supplier/supplier.reducer';
import * as fromCompliance from './compliance/compliance.reducer';
import * as fromProduct from './product/product.reducer';
import * as fromSuperuser from './superuser/superuser.reducer';
import * as fromCustomer from './customer/customer.reducer';
import * as fromEditTables from './editTables/editTables.reducer';

export const adminFeatureKey = 'admin';

export interface State {
  [fromSupplier.suppliersFeatureKey]: fromSupplier.State;
  [fromCompliance.compliancesFeatureKey]: fromCompliance.State;
  [fromProduct.productsFeatureKey]: fromProduct.State;
  [fromSuperuser.superuserFeatureKey]: fromSuperuser.SuperuserState;
  [fromCustomer.customersFeatureKey]: fromCustomer.State;
  [fromEditTables.editTablesFeatureKey]: fromEditTables.State;
}

export const reducers: ActionReducerMap<State> = {
  [fromSupplier.suppliersFeatureKey]: fromSupplier.reducer,
  [fromCompliance.compliancesFeatureKey]: fromCompliance.reducer,
  [fromProduct.productsFeatureKey]: fromProduct.reducer,
  [fromSuperuser.superuserFeatureKey]: fromSuperuser.reducer,
  [fromCustomer.customersFeatureKey]: fromCustomer.reducer,
  [fromEditTables.editTablesFeatureKey]: fromEditTables.reducer
};

export const REDUCERS_TOKEN = new InjectionToken<ActionReducerMap<State>>('Admin Reducers');
export const reducerProvider = { provide: REDUCERS_TOKEN, useValue: reducers };

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];

export const selectAdminState = createFeatureSelector<State>(adminFeatureKey);
