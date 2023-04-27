import { createSelector } from '@ngrx/store';

import { selectAdminState } from '..';
import * as fromSuperuser from './superuser.reducer';

export const selectSuperuserState = createSelector(
  selectAdminState,
  state => state[fromSuperuser.superuserFeatureKey]
);

// AccessManagement
export const selectAccessManagementState = createSelector(
  selectSuperuserState,
  state => state.accessManagement as fromSuperuser.AccessManagementState
);

export const selectAccessManagementList = createSelector(
  selectAccessManagementState,
  fromSuperuser.selectAccessManagementAll
);

export const selectAccessManagementCached = createSelector(
  selectAccessManagementState,
  state => state.cached
);

export const selectAccessManagementLoaded = createSelector(
  selectAccessManagementState,
  state => state.loaded
);

export const selectAccessManagementLoading = createSelector(
  selectAccessManagementState,
  state => state.loading
);

export const selectAccessManagementFilters = createSelector(
  selectAccessManagementState,
  state => state.filters
);

// ErrorHandling
export const selectErrorHandlingState = createSelector(
  selectSuperuserState,
  state => state.errorHandling as fromSuperuser.ErrorHandlingState
);

export const selectErrorHandlingList = createSelector(
  selectErrorHandlingState,
  fromSuperuser.selectErrorHandlingAll
);

export const selectErrorHandlingCached = createSelector(
  selectErrorHandlingState,
  state => state.cached
);

export const selectErrorHandlingLoaded = createSelector(
  selectErrorHandlingState,
  state => state.loaded
);

export const selectErrorHandlingLoading = createSelector(
  selectErrorHandlingState,
  state => state.loading
);

export const selectErrorHandlingFilters = createSelector(
  selectErrorHandlingState,
  state => state.filters
);

// AccessLog
export const selectAccessLogState = createSelector(
  selectSuperuserState,
  state => state.accessLog as fromSuperuser.AccessLogState
);

export const selectAccessLogList = createSelector(
  selectAccessLogState,
  fromSuperuser.selectAccessLogAll
);

export const selectAccessLogCached = createSelector(
  selectAccessLogState,
  state => state.cached
);

export const selectAccessLogLoaded = createSelector(
  selectAccessLogState,
  state => state.loaded
);

export const selectAccessLogLoading = createSelector(
  selectAccessLogState,
  state => state.loading
);

export const selectAccessLogFilters = createSelector(
  selectAccessLogState,
  state => state.filters
);
