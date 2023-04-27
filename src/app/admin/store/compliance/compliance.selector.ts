import { createSelector } from '@ngrx/store';
import { selectAdminState } from '..';
import * as fromCompliance from './compliance.reducer';

export const selectComplianceState = createSelector(
  selectAdminState,
  state => state[fromCompliance.compliancesFeatureKey]
);

export const selectCompliances = createSelector(
  selectComplianceState,
  fromCompliance.selectAll
);

export const selectComplianceLoaded = createSelector(
  selectComplianceState,
  state => state.loaded
);

export const selectComplianceLoading = createSelector(
  selectComplianceState,
  state => state.loading
);

export const selectComplianceFilters = createSelector(
  selectComplianceState,
  state => state.filters
);

export const selectCachedCompliances = createSelector(
  selectComplianceState,
  state => state.cached
);

export const selectComplianceSort = createSelector(
  selectComplianceState,
  state => state.sort
);

export const selectComplianceDetails = createSelector(
  selectComplianceState,
  state => state.details.item
);

export const selectComplianceDetailsItem = createSelector(
  selectComplianceDetails,
  state => state.supplier
);

export const selectComplianceSupplierReview = createSelector(
  selectComplianceDetails,
  state => state.review
);

export const selectComplianceAssessment = createSelector(
  selectComplianceDetails,
  state => state.assessment
);

export const selectComplianceProducts = createSelector(
  selectComplianceDetails,
  state => state.products
);

export const selectComplianceDetailsLoaded = createSelector(
  selectComplianceState,
  state => state.details.loaded
);

export const selectComplianceDetailsLoading = createSelector(
  selectComplianceState,
  state => state.details.loading
);

export const selectComplianceInformationSecurity = createSelector(
  selectComplianceDetails,
  state => state.informationSecurity
);
