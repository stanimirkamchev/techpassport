import { createSelector } from '@ngrx/store';
import { selectAdminState } from '..';
import * as fromProduct from './product.reducer';

export const selectProductState = createSelector(
  selectAdminState,
  state => state[fromProduct.productsFeatureKey]
);

export const selectProducts = createSelector(
  selectProductState,
  fromProduct.selectAll
);

export const selectProductsLoading = createSelector(
  selectProductState,
  state => state.loading
);

export const selectProductsLoaded = createSelector(
  selectProductState,
  state => state.loaded
);

export const selectCachedProducts = createSelector(
  selectProductState,
  state => state.cached
);

export const selectProductsFilters = createSelector(
  selectProductState,
  state => state.filters
);

export const selectProductLoaded = createSelector(
  selectProductState,
  state => state.loaded
);

export const selectProductDetails = createSelector(
  selectProductState,
  state => state.details.item
);

export const selectProductDetailsItem = createSelector(
  selectProductDetails,
  state => state.product
);

export const selectProductReview = createSelector(
  selectProductDetails,
  state => state.review
);

export const selectProductSupplier = createSelector(
  selectProductDetails,
  state => state.supplier
);

export const selectProductCompliance = createSelector(
  selectProductDetails,
  state => state.assessment
);

export const selectProductInformationSecurity = createSelector(
  selectProductDetails,
  state => state.informationSecurity
);

export const selectProductDetailsLoaded = createSelector(
  selectProductState,
  state => state.details.loaded
);

export const selectProductDetailsLoading = createSelector(
  selectProductState,
  state => state.details.loading
);
