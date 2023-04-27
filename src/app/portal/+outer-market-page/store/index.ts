import { ActionReducerMap, createFeatureSelector, MetaReducer } from '@ngrx/store';
import { InjectionToken } from '@angular/core';


import { environment } from '../../../../environments/environment';
import * as fromOuterMarket from './index.reducer';

export const outerMarketFeatureKey = 'outerMarket';

export const REDUCERS_TOKEN = new InjectionToken<ActionReducerMap<fromOuterMarket.State>>('OuterMarket Reducers');
export const reducerProvider = { provide: REDUCERS_TOKEN, useValue: fromOuterMarket.reducer };

export const metaReducers: MetaReducer<fromOuterMarket.State>[] = !environment.production ? [] : [];

export const selectOuterMarketDataState = createFeatureSelector<fromOuterMarket.State>(outerMarketFeatureKey);

