import { createAction, props } from '@ngrx/store';

export const loadDataTable = createAction(
  '[Marketplace/API] Load Data Table'
);

export const loadDataTableSuccess = createAction(
  '[Marketplace/API] Load Data Table Success',
  props<{ data: any[] }>()
);

export const loadDataTableError = createAction(
  '[Marketplace/API] Load Data Table Error',
  props<{ error: any }>()
);

export const addWatchlistCount = createAction(
  '[Marketplace/API] Add Watchlist Count',
  props<{ data: string[] }>()
);

export const addWatchlistCountSuccess = createAction(
  '[Marketplace/API] Add Watchlist Count Success',
);
