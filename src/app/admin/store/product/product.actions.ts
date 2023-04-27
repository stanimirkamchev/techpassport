import { createAction, props } from '@ngrx/store';
import { Sort } from '@angular/material/sort';

import { Product, ProductsFilters, ProductDetails } from './product.model';

// loadProducts
export const loadProducts = createAction(
  '[Product/API] Load Products'
);

export const loadProductsSuccess = createAction(
  '[Product/API] Load Products Success',
  props<{ products: Product[] }>()
);

export const loadProductsError = createAction(
  '[Product/API] Load Products Error',
  props<{ error: any }>()
);


// filterProducts sortProducts
export const filterProducts = createAction(
  '[Product/API] Filter Products',
  props<{ filters: ProductsFilters }>()
);

export const sortProducts = createAction(
  '[Product/API] Sort Products',
  props<{ sort: Sort }>()
);


// loadProductDetails
export const loadProductDetails = createAction(
  '[Product/API] Load Product Details',
  props<{ id: string }>()
);

export const loadProductDetailsSuccess = createAction(
  '[Product/API] Load Product Details Success',
  props<{ productDetails: ProductDetails }>()
);

export const loadProductDetailsError = createAction(
  '[Product/API] Load Product Details Error',
  props<{ error: any }>()
);


// downloadProducts
export const downloadProducts = createAction(
  '[Product/API] Download Products',
  props<{ products: Product[] }>()
);


// downloadProduct
export const downloadProduct = createAction(
  '[Product/API] Download Product',
  props<{ product: Product }>()
);

export const downloadProductSuccess = createAction(
  '[Product/API] Download Product Success',
  props<{ product: Product }>()
);

export const downloadProductError = createAction(
  '[Product/API] Download Product Error',
  props<{ error: any }>()
);


// approveProduct
export const approveProduct = createAction(
  '[Product/API] Approve Product',
  props<{ product: Product }>()
);

export const approveProductSuccess = createAction(
  '[Product/API] Approve Product Success',
  props<{ product: Product }>()
);

export const approveProductError = createAction(
  '[Product/API] Approve Product Error',
  props<{ error: any }>()
);


// rejectProduct
export const rejectProduct = createAction(
  '[Product/API] Reject Product',
  props<{ product: Product }>()
);

export const rejectProductSuccess = createAction(
  '[Product/API] Reject Product Success',
  props<{ product: Product }>()
);

export const rejectProductError = createAction(
  '[Product/API] Reject Product Error',
  props<{ error: any }>()
);


// showRejectionDetails
export const showRejectionDetails = createAction(
  '[Product/API] Show Rejection Details',
  props<{ product: Product }>()
);


// editProduct
export const editProduct = createAction(
  '[Product/API] Edit Product',
  props<{ product: Product }>()
);
