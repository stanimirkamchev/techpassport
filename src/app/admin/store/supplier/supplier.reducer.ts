import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Supplier, SuppliersFilters, SupplierStatus, SuppliersBuilder, SupplierDetails } from './supplier.model';
import * as SupplierActions from './supplier.actions';
import { Sort } from '@angular/material/sort';
import { TypedAction } from '@ngrx/store/src/models';

export const suppliersFeatureKey = 'suppliers';

const selectSupplierId = (supplier: Supplier) => supplier._id;

export interface State extends EntityState<Supplier> {
  sort?: Sort;
  loaded: boolean;
  loading: boolean;
  cached: Supplier[];
  filters: SuppliersFilters;
  details: {
    item: SupplierDetails;
    loaded: boolean;
    loading: boolean;
  };
}

export const adapter: EntityAdapter<Supplier> = createEntityAdapter<Supplier>({
  selectId: selectSupplierId,
});

export const initialState: State = adapter.getInitialState({
  loaded: false,
  loading: false,
  cached: [],
  filters: {},
  details: {
    item: {} as SupplierDetails,
    loaded: false,
    loading: false,
  }
});


export const reducer = createReducer(
  initialState,
  on(SupplierActions.loadSuppliers,
    (state) => ({
      ...state,
      loading: true
    })
  ),
  on(SupplierActions.loadSuppliersSuccess,
    (state, action) => ({
      ...adapter.setAll(action.suppliers, state),
      cached: action.suppliers,
      loading: false,
      loaded: true
    })
  ),
  on(SupplierActions.loadSuppliersError,
    (state) => ({
      ...state,
      loading: false,
      loaded: false
    })
  ),
  on(
    SupplierActions.sortSuppliers,
    SupplierActions.filterSuppliers,
    (state, action) => {
      const products = new SuppliersBuilder(state.cached)
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
  on(SupplierActions.loadSupplierDetails,
    (state) => ({
      ...state,
      details: {
        ...state.details,
        loading: true
      }
    })
  ),
  on(SupplierActions.loadSupplierDetailsSuccess,
    (state, action) => ({
      ...state,
      details: {
        ...state.details,
        loading: false,
        loaded: true,
        item: action.supplierDetails
      }
    })
  ),
  on(SupplierActions.loadSupplierDetailsError,
    (state) => ({
      ...state,
      details: {
        ...state.details,
        loading: false,
        loaded: false
      }
    })
  ),
  on(SupplierActions.rejectSupplierSuccess,
    (state, { supplier }) => ({
      ...state,
      ...adapter.updateOne({ id: supplier._id, changes: { status: SupplierStatus.Rejected } }, state),
      details: {
        ...state.details,
        item: {
          ...state.details.item,
          supplier: {
            ...state.details.item.supplier,
            status: SupplierStatus.Rejected
          }
        }
      }
    })
  ),
  on(SupplierActions.approveSupplierSuccess,
    (state, { supplier }) => ({
      ...state,
      ...adapter.updateOne({ id: supplier._id, changes: { status: SupplierStatus.Approved } }, state),
      details: {
        ...state.details,
        item: {
          ...state.details.item,
          supplier: {
            ...state.details.item.supplier,
            status: SupplierStatus.Approved
          }
        }
      }
    })
  )
);

const isFilterType = (action): action is TypedAction<'[Supplier/API] Filter Suppliers'> => {
  return !action.sort;
};

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
