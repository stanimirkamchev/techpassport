import { createFeatureSelector, MetaReducer } from '@ngrx/store';
import { InjectionToken } from '@angular/core';

import { environment } from '../../../environments/environment';
import * as fromDashboard from './dashboard.reducer';

export const dashboardFeatureKey = 'dashboard';

export const REDUCERS_TOKEN = new InjectionToken<fromDashboard.State>('Dashboard Reducer');
export const reducerProvider = { provide: REDUCERS_TOKEN, useValue: fromDashboard.reducer };

export const metaReducers: MetaReducer<fromDashboard.State>[] = !environment.production ? [] : [];

export const selectDashboardState = createFeatureSelector<fromDashboard.State>(dashboardFeatureKey);
