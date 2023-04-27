import { createSelector } from '@ngrx/store';
import { selectMarketplaceState } from './index';

export const selectOuterMarketState = createSelector(
  selectMarketplaceState,
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

