import {createAction, props} from '@ngrx/store';
import {OuterMarketTableModel} from '../outerMarket.models';

// loadProducts
export const loadDataTable = createAction(
  '[OuterMarket/API] Load Data Table'
);

export const loadDataTableSuccess = createAction(
  '[OuterMarket/API] Load Data Table Success',
  props<{data: OuterMarketTableModel[]}>()
);

export const loadDataTableError = createAction(
  '[OuterMarket/API] Load Data Table Error',
  props<{error: any}>()
);

// loadSearchesPreview
export const loadSearchesPreview = createAction(
  '[OuterMarket/API] Load Searches Preview',
);

export const loadSearchesPreviewSuccess = createAction(
  '[OuterMarket/API] Load Searches Preview Success',
  props<{preview: any}>()
);

export const loadSearchesPreviewError = createAction(
  '[OuterMarket/API] Load Searches Preview Error',
  props<{error: any}>()
);

// downloadOuterMarket
export const uploadOuterMarket = createAction(
  '[OuterMarket/API] Upload OuterMarket',
  props<{data: OuterMarketTableModel[]}>()
);