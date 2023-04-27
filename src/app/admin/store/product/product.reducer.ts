import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Sort } from '@angular/material/sort';

import { Product, ProductsFilters, ProductsBuilder, ProductDetails, ProductStatus } from './product.model';
import * as ProductActions from './product.actions';
import { TypedAction } from '@ngrx/store/src/models';

export const productsFeatureKey = 'products';

const selectProductId = (product: Product) => product._id;

export interface State extends EntityState<Product> {
  sort?: Sort;
  loaded: boolean;
  loading: boolean;
  cached: Product[];
  filters: ProductsFilters;
  details: {
    item: ProductDetails;
    loaded: boolean;
    loading: boolean;
  };
}

export const adapter: EntityAdapter<Product> = createEntityAdapter<Product>({
  selectId: selectProductId
});

export const initialState: State = adapter.getInitialState({
  loaded: false,
  loading: false,
  cached: [],
  filters: {},
  details: {
    item: {} as ProductDetails,
    loaded: false,
    loading: false,
  }
});

export const reducer = createReducer(
  initialState,
  on(ProductActions.loadProducts,
    (state) => ({
      ...state,
      loading: true
    })
  ),
  on(ProductActions.loadProductsSuccess,
    (state, action) => ({
      ...adapter.setAll(action.products, state),
      cached: action.products,
      loading: false,
      loaded: true
    })
  ),
  on(ProductActions.loadProductsError,
    (state) => ({
      ...state,
      loading: false,
      loaded: false
    })
  ),
  on(
    ProductActions.sortProducts,
    ProductActions.filterProducts,
    (state, action) => {
      const products = new ProductsBuilder(state.cached)
        .filter(isFilterType(action) ? action.filters : state.filters)
        .sort(isFilterType(action) ? state.sort : action.sort)
        .get();
      return {
        ...state,
        ...adapter.setAll(products, state),
        sort: isFilterType(action) ? state.sort : action.sort,
        filters: isFilterType(action) ? action.filters : state.filters
      };
    }
  ),
  on(ProductActions.loadProductDetails,
    (state) => ({
      ...state,
      details: {
        ...state.details,
        loading: true
      }
    })
  ),
  on(ProductActions.loadProductDetailsSuccess,
    (state, action) => ({
      ...state,
      details: {
        ...state.details,
        loading: false,
        loaded: true,
        item: action.productDetails
      }
    })
  ),
  on(ProductActions.loadProductDetailsError,
    (state) => ({
      ...state,
      details: {
        ...state.details,
        loading: false,
        loaded: false
      }
    })
  ),
  on(ProductActions.rejectProductSuccess,
    (state, { product }) => ({
      ...state,
      ...adapter.updateOne({ id: product._id, changes: { status: ProductStatus.Rejected }  }, state),
      details: {
        ...state.details,
        item: {
          ...state.details.item,
          product: {
            ...state.details.item.product,
            status: ProductStatus.Rejected
          }
        }
      }
    })
  ),
  on(ProductActions.approveProductSuccess,
    (state, { product }) => ({
      ...state,
      ...adapter.updateOne({ id: product._id, changes: { status: ProductStatus.Approved } }, state),
      details: {
        ...state.details,
        item: {
          ...state.details.item,
          product: {
            ...state.details.item.product,
            status: ProductStatus.Approved
          }
        }
      }
    })
  )
);

const isFilterType = (action): action is TypedAction<'[Product/API] Filter Products'> => {
  return !action.sort;
};

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
