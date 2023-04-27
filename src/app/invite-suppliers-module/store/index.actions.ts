import { createAction, props } from '@ngrx/store';
import { InvitationFilter, InvitationStatus, InviteSuppliersTableModel } from '../invite-suppliers.model';

// TABLE DATA
export const loadDataTable = createAction(
  '[InviteSuppliers/API] Load Data Table'
);

export const loadDataTableSuccess = createAction(
  '[InviteSuppliers/API] Load Data Table Success',
  props<{ data: InviteSuppliersTableModel[] }>()
);

export const loadDataTableError = createAction(
  '[InviteSuppliers/API] Load Data Table Error',
  props<{ error: any }>()
);

export const setStatus = createAction(
  '[InviteSuppliers/API] Set Status',
  props<{ element: InviteSuppliersTableModel, status: InvitationStatus }>()
);

// FILTERS
export const setFilter = createAction(
  '[InviteSuppliers/API] Set FIlter',
  props<{ filter: InvitationFilter }>()
);

export const loadFilter = createAction(
  '[InviteSuppliers/API] Load FIlter'
);
