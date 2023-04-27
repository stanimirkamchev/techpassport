import { createSelector } from '@ngrx/store';
import { selectAdminState } from '..';
import * as fromSupplier from './supplier.reducer';

export const selectSupplierState = createSelector(
  selectAdminState,
  state => state[fromSupplier.suppliersFeatureKey]
);

export const selectSuppliers = createSelector(
  selectSupplierState,
  fromSupplier.selectAll
);

export const selectCachedSuppliers = createSelector(
  selectSupplierState,
  state => state.cached
);

export const selectSuppliersFilters = createSelector(
  selectSupplierState,
  state => state.filters
);

export const selectSupplierLoaded = createSelector(
  selectSupplierState,
  state => state.loaded
);

export const selectSupplierLoading = createSelector(
  selectSupplierState,
  state => state.loading
);

export const selectSupplierDetails = createSelector(
  selectSupplierState,
  state => state.details.item
);

export const selectSupplierProducts = createSelector(
  selectSupplierState,
  state => state.details.item.products
);

export const selectSupplierReview = createSelector(
  selectSupplierState,
  state => state.details.item.review
);

export const selectSupplierCompliance = createSelector(
  selectSupplierState,
  state => state.details.item.assessment
);

export const selectSupplierInformationSecurity = createSelector(
  selectSupplierState,
  state => state.details.item.informationSecurity
);

export const selectSupplierDetailsLoaded = createSelector(
  selectSupplierState,
  state => state.details.loaded
);

export const selectSupplierDetailsLoading = createSelector(
  selectSupplierState,
  state => state.details.loading
);
