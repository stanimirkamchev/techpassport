import { ActionReducerMap, createFeatureSelector, MetaReducer } from '@ngrx/store';
import { InjectionToken } from '@angular/core';


import { environment } from '../../../environments/environment';
import * as fromMarkeplace from './index.reducer';

export const marketplaceFeatureKey = 'marketplace';

export const REDUCERS_TOKEN = new InjectionToken<ActionReducerMap<fromMarkeplace.State>>('Marketplace Reducers');
export const reducerProvider = { provide: REDUCERS_TOKEN, useValue: fromMarkeplace.reducer };

export const metaReducers: MetaReducer<fromMarkeplace.State>[] = !environment.production ? [] : [];

export const selectMarketplaceState = createFeatureSelector<fromMarkeplace.State>(marketplaceFeatureKey);
