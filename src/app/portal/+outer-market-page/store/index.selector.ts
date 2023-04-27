import { createSelector } from '@ngrx/store';
import { selectAll } from './index.reducer';
import { selectOuterMarketDataState } from './index'

export const selectOuterMarketState = createSelector(
  selectOuterMarketDataState,
  state => state
);

export const selectData = createSelector(
  selectOuterMarketState,
  state => state.data
);

export const selectDataLoading = createSelector(
  selectOuterMarketState,
  state => state.loading
);

export const selectDataLoaded = createSelector(
  selectOuterMarketState,
  state => state.loaded
);

// searches preview
export const selectSearchesPreviewState = createSelector(
  selectOuterMarketDataState,
  state => state.preview
);

export const selectSearchesPreview = createSelector(
  selectSearchesPreviewState,
  state => state.preview
);

export const selectSearchesPreviewLoading = createSelector(
  selectSearchesPreviewState,
  state => state.preview.loading
);

export const selectSearchesPreviewLoaded = createSelector(
  selectSearchesPreviewState,
  state => state.preview
);

