import { ActionReducer, ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store';
import { InjectionToken } from '@angular/core';

import { environment } from '../../../environments/environment';
import * as fromBuyer from './buyer/buyer.reducer';

export const onboardingFeatureKey = 'onboarding';

export interface State {
  [fromBuyer.buyerFeatureKey]: fromBuyer.State;
}

export const reducers: ActionReducerMap<State> = {
  [fromBuyer.buyerFeatureKey]: fromBuyer.reducer,
};

export const REDUCERS_TOKEN = new InjectionToken<ActionReducerMap<State>>('Onboarding Reducers');
export const reducerProvider = { provide: REDUCERS_TOKEN, useValue: reducers };

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];

export const selectOnboaringState = createFeatureSelector<State>(onboardingFeatureKey);
