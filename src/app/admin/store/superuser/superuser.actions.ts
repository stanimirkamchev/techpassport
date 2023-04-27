import { createAction, props } from '@ngrx/store';
import { Sort } from '@angular/material/sort';
// tslint:disable
import { AccessManagement, ErrorHandling, AccessLog, AccessManagementFilters, ErrorHandlingFilters, AccessLogFilters, UserDTO } from './superuser.model';
// tslint:enable

// loadAccessManagement
export const loadAccessManagement = createAction(
  '[Superuser/API] Load AccessManagement'
);

export const loadAccessManagementSuccess = createAction(
  '[Superuser/API] Load AccessManagement Success',
  props<{ accessManagement: AccessManagement[] }>()
);

export const loadAccessManagementError = createAction(
  '[Superuser/API] Load AccessManagement Error',
  props<{ error: any }>()
);


export const filterAccessManagement = createAction(
  '[Superuser/API] Filter AccessManagement',
  props<{ filters: AccessManagementFilters }>()
);

export const sortAccessManagement = createAction(
  '[Supplier/API] Sort AccessManagement',
  props<{ sort: Sort }>()
);

// downloadAccessManagement
export const downloadAccessManagement = createAction(
  '[Superuser/API] Download AccessManagement',
  props<{ accessManagement: AccessManagement[] }>()
);



// loadErrorHandling
export const loadErrorHandling = createAction(
  '[Superuser/API] Load ErrorHandling'
);

export const loadErrorHandlingSuccess = createAction(
  '[Superuser/API] Load ErrorHandling Success',
  props<{ errorHandling: ErrorHandling[] }>()
);

export const loadErrorHandlingError = createAction(
  '[Superuser/API] Load ErrorHandling Error',
  props<{ error: any }>()
);


export const filterErrorHandling = createAction(
  '[Superuser/API] Filter ErrorHandling',
  props<{ filters: ErrorHandlingFilters }>()
);

export const sortErrorHandling = createAction(
  '[Supplier/API] Sort ErrorHandling',
  props<{ sort: Sort }>()
);

// downloadErrorHandling
export const downloadErrorHandling = createAction(
  '[Superuser/API] Download ErrorHandling',
  props<{ errorHandling: ErrorHandling[] }>()
);


// loadAccessLog
export const loadAccessLog = createAction(
  '[Superuser/API] Load AccessLog'
);

export const loadAccessLogSuccess = createAction(
  '[Superuser/API] Load AccessLog Success',
  props<{ accessLog: AccessLog[] }>()
);

export const loadAccessLogError = createAction(
  '[Superuser/API] Load AccessLog Error',
  props<{ error: any }>()
);


export const filterAccessLog = createAction(
  '[Superuser/API] Filter AccessLog',
  props<{ filters: AccessLogFilters }>()
);

export const sortAccessLog = createAction(
  '[Superuser/API] Sort AccessLog',
  props<{ sort: Sort }>()
);

// downloadAccessLog
export const downloadAccessLog = createAction(
  '[Superuser/API] Download AccessLog',
  props<{ accessLog: AccessLog[] }>()
);


// createUser
export const createUser = createAction(
  '[Superuser/API] Create User'
);

export const createUserSuccess = createAction(
  '[Superuser/API] Create User Success',
  props<{ user: UserDTO }>()
);

export const createUserError = createAction(
  '[Superuser/API] Create User Error',
  props<{ error: any }>()
);


// unlockUser
export const unlockUser = createAction(
  '[Superuser/API] Unlock User',
  props<{ id: string, displayName: string, email: string  }>()
);

export const unlockUserSuccess = createAction(
  '[Superuser/API] Unlock User Success',
  props<{ user: UserDTO }>()
);

export const unlockUserError = createAction(
  '[Superuser/API] Unlock User Error',
  props<{ error: any }>()
);


// lockUser
export const lockUser = createAction(
  '[Superuser/API] Lock User',
  props<{ id: string, displayName: string, email: string  }>()
);

export const lockUserSuccess = createAction(
  '[Superuser/API] Lock User Success',
  props<{ user: UserDTO }>()
);

export const lockUserError = createAction(
  '[Superuser/API] Lock User Error',
  props<{ error: any }>()
);


// deleteUser
export const deleteUser = createAction(
  '[Superuser/API] Delete User',
  props<{ id: string, displayName: string, email: string }>()
);

export const deleteUserSuccess = createAction(
  '[Superuser/API] Delete User Success',
  props<{ id: string }>()
);

export const deleteUserError = createAction(
  '[Superuser/API] Delete User Error',
  props<{ error: any }>()
);


// destroySession
export const destroySession = createAction(
  '[Superuser/API] Destroy Session',
  props<{ id: string, isSamlAuthenticated: boolean, displayName: string, ip: string  }>()
);

export const destroySessionSuccess = createAction(
  '[Superuser/API] Destroy Session Success',
  props<{ id: string }>()
);

export const destroySessionError = createAction(
  '[Superuser/API] Destroy Session Error',
  props<{ error: any }>()
);
