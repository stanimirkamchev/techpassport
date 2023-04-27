import { createSelector } from '@ngrx/store';
import { selectInviteSuppliersDataState } from './index';

export const selectOuterMarketState = createSelector(
  selectInviteSuppliersDataState,
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

export const loadFilter = createSelector(
  selectOuterMarketState,
  state => state.filterPreview
);

