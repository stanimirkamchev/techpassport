import { ActionReducerMap, createFeatureSelector, MetaReducer } from '@ngrx/store';
import { InjectionToken } from '@angular/core';


import { environment } from '../../../environments/environment';
import * as fromInviteSuppliersMarket from './index.reducer';

export const inviteSuppliersFeatureKey = 'inviteSuppliers';

export const REDUCERS_TOKEN = new InjectionToken<ActionReducerMap<fromInviteSuppliersMarket.State>>('InviteSuppliers Reducers');
export const reducerProvider = { provide: REDUCERS_TOKEN, useValue: fromInviteSuppliersMarket.reducer };

export const metaReducers: MetaReducer<fromInviteSuppliersMarket.State>[] = !environment.production ? [] : [];

export const selectInviteSuppliersDataState = createFeatureSelector<fromInviteSuppliersMarket.State>(inviteSuppliersFeatureKey);

