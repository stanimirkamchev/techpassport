import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Sort } from '@angular/material/sort';

import { Supplier, SuppliersFilters, SupplierDetails } from './supplier.model';

export const loadSuppliers = createAction(
  '[Supplier/API] Load Suppliers'
);

export const loadSuppliersSuccess = createAction(
  '[Supplier/API] Load Suppliers Success',
  props<{ suppliers: Supplier[] }>()
);

export const loadSuppliersError = createAction(
  '[Supplier/API] Load Suppliers Error',
  props<{ error: any }>()
);


export const filterSuppliers = createAction(
  '[Supplier/API] Filter Suppliers',
  props<{ filters: SuppliersFilters }>()
);

export const sortSuppliers = createAction(
  '[Supplier/API] Sort Suppliers',
  props<{ sort: Sort }>()
);


export const loadSupplierDetails = createAction(
  '[Supplier/API] Load Supplier Details',
  props<{ id: string }>()
);

export const loadSupplierDetailsSuccess = createAction(
  '[Supplier/API] Load Supplier Details Success',
  props<{ supplierDetails: SupplierDetails }>()
);

export const loadSupplierDetailsError = createAction(
  '[Supplier/API] Load Supplier Details Error',
  props<{ error: any }>()
);


// downloadSupplier
export const downloadSupplier = createAction(
  '[Supplier/API] Download Supplier',
  props<{ id: string }>()
);

export const downloadSupplierSuccess = createAction(
  '[Supplier/API] Download Supplier Success',
  props<{ id: string }>()
);

export const downloadSupplierError = createAction(
  '[Supplier/API] Download Supplier Error',
  props<{ error: any }>()
);


// downloadSuppliers
export const downloadSuppliers = createAction(
  '[Supplier/API] Download Suppliers',
  props<{ suppliers: Supplier[] }>()
);

// approveSupplier
export const approveSupplier = createAction(
  '[Supplier/API] Approve Supplier',
  props<{ supplier: Supplier }>()
);

export const approveSupplierSuccess = createAction(
  '[Supplier/API] Approve Supplier Success',
  props<{ supplier: Supplier }>()
);

export const approveSupplierError = createAction(
  '[Supplier/API] Approve Supplier Error',
  props<{ error: any }>()
);


// rejectSupplier
export const rejectSupplier = createAction(
  '[Supplier/API] Reject Supplier',
  props<{ supplier: Supplier }>()
);

export const rejectSupplierSuccess = createAction(
  '[Supplier/API] Reject Supplier Success',
  props<{ supplier: Supplier }>()
);

export const rejectSupplierError = createAction(
  '[Supplier/API] Reject Supplier Error',
  props<{ error: any }>()
);


// showRejectionDetails
export const showRejectionDetails = createAction(
  '[Supplier/API] Show Rejection Details',
  props<{ supplier: Supplier }>()
);

// editSupplierCompliance
export const addSupplierProduct = createAction(
  '[Supplier/API] Add Supplier Product',
  props<{ supplier: Supplier }>()
);

// editSupplierCompliance
export const editSupplierCompliance = createAction(
  '[Supplier/API] Edit Supplier Compliance',
  props<{ supplier: Supplier }>()
);
