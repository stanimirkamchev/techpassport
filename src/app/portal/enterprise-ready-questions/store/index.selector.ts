import { createSelector } from '@ngrx/store';
import { selectERQDataState } from './index';

export const selectERQState = createSelector(
  selectERQDataState,
  state => state
);

export const selectData = createSelector(
  selectERQState,
  state => state.data
);

export const selectDataLoading = createSelector(
  selectERQState,
  state => state.loading
);

export const selectDataLoaded = createSelector(
  selectERQState,
  state => state.loaded
);

