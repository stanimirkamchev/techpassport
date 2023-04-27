import { ActionReducerMap, createFeatureSelector, MetaReducer } from '@ngrx/store';
import { InjectionToken } from '@angular/core';


import { environment } from '../../../../environments/environment';
import * as fromERQ from './index.reducer';

export const ERQFeatureKey = 'ERQ';

export const REDUCERS_TOKEN = new InjectionToken<ActionReducerMap<fromERQ.State>>('ERQ Reducers');
export const reducerProvider = { provide: REDUCERS_TOKEN, useValue: fromERQ.reducer };

export const metaReducers: MetaReducer<fromERQ.State>[] = !environment.production ? [] : [];

export const selectERQDataState = createFeatureSelector<fromERQ.State>(ERQFeatureKey);

