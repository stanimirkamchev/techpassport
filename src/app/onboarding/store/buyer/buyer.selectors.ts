import { createSelector } from '@ngrx/store';
import { selectOnboaringState } from '..';
import * as fromBuyer from './buyer.reducer';

export const selectBuyerState = createSelector(
  selectOnboaringState,
  state => state[fromBuyer.buyerFeatureKey]
);

export const selectBuyerValue = createSelector(
  selectBuyerState,
  state => state.value
);
