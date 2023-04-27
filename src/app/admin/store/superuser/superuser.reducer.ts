import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Sort } from '@angular/material/sort';

// tslint:disable
import { AccessManagement, ErrorHandling, AccessLog, AccessManagementFilters, ErrorHandlingFilters, AccessLogFilters, AccessManagementBuilder, ErrorHandlingBuilder, AccessLogBuilder, AccessUserStatus, AccessLogStatus } from './superuser.model';
// tslint:enable
import { selectIdentifiableId as selectId } from '@abstract/identifiable';
import * as SuperuserActions from './superuser.actions';

export const superuserFeatureKey = 'superuser';

// AccessManagementState
export interface AccessManagementState extends EntityState<AccessManagement> {
  loaded: boolean;
  loading: boolean;
  sort?: Sort;
  filters: AccessManagementFilters;
  cached: AccessManagement[];
}
export const accessManagementAdapter: EntityAdapter<AccessManagement> = createEntityAdapter<AccessManagement>({ selectId });
export const accessManagementInitialState: AccessManagementState = accessManagementAdapter.getInitialState({
  loaded: false,
  loading: false,
  filters: {} as AccessManagementFilters,
  cached: []
});

// ErrorHandlingState
export interface ErrorHandlingState extends EntityState<ErrorHandling> {
  loaded: boolean;
  loading: boolean;
  sort?: Sort;
  filters: ErrorHandlingFilters;
  cached: ErrorHandling[];
}
export const errorHandlingAdapter: EntityAdapter<ErrorHandling> = createEntityAdapter<ErrorHandling>({ selectId });
export const errorHandlingInitialState: ErrorHandlingState = errorHandlingAdapter.getInitialState({
  loaded: false,
  loading: false,
  filters: {} as ErrorHandlingFilters,
  cached: []
});

// AccessLogState
export interface AccessLogState extends EntityState<AccessLog> {
  loaded: boolean;
  loading: boolean;
  sort?: Sort;
  filters: AccessLogFilters;
  cached: AccessLog[];
}
export const accessLogAdapter: EntityAdapter<AccessLog> = createEntityAdapter<AccessLog>({ selectId });
export const accessLogInitialState: AccessLogState = accessLogAdapter.getInitialState({
  loaded: false,
  loading: false,
  sort: {
    active: 'accessDate',
    direction: 'desc'
  },
  filters: {} as AccessLogFilters,
  cached: []
});

export interface SuperuserState {
  accessManagement: AccessManagementState;
  errorHandling: ErrorHandlingState;
  accessLog: AccessLogState;
}


export const initialState: SuperuserState = {
  accessManagement: accessManagementInitialState,
  errorHandling: errorHandlingInitialState,
  accessLog: accessLogInitialState
};

export const reducer = createReducer(
  initialState,
  on(SuperuserActions.loadAccessManagement,
    (state) => ({
      ...state,
      accessManagement: {
        ...state.accessManagement,
        loading: true
      }
    })
  ),
  on(SuperuserActions.loadAccessManagementSuccess,
    (state, { accessManagement }) => ({
      ...state,
      accessManagement: {
        ...accessManagementAdapter.setAll(new AccessManagementBuilder(accessManagement)
          .sort(state.accessManagement.sort)
          .filter(state.accessManagement.filters).get(), state.accessManagement),
        cached: accessManagement,
        loading: false,
        loaded: true
      }
    })
  ),
  on(SuperuserActions.loadAccessManagementError,
    (state) => ({
      ...state,
      accessManagement: {
        ...state.accessManagement,
        loading: false,
        loaded: false
      }
    })
  ),
  on(SuperuserActions.filterAccessManagement,
    (state, { filters }) => {
      const { accessManagement } = state;
      const accessManagementList = new AccessManagementBuilder(accessManagement.cached).filter(filters).get();
      return {
        ...state,
        accessManagement: {
          ...accessManagement,
          ...accessManagementAdapter.setAll(accessManagementList, state.accessManagement),
          filters
        }
      };
    }
  ),
  on(SuperuserActions.sortAccessManagement,
    (state, { sort }) => {
      const { accessManagement } = state;
      const accessManagementList = new AccessManagementBuilder(accessManagement.cached).sort(sort).get();
      return {
        ...state,
        accessManagement: {
          ...accessManagement,
          ...accessManagementAdapter.setAll(accessManagementList, state.accessManagement),
          sort
        }
      };
    }
  ),
  on(SuperuserActions.loadErrorHandling,
    (state) => ({
      ...state,
      errorHandling: {
        ...state.errorHandling,
        loading: true
      }
    })
  ),
  on(SuperuserActions.loadErrorHandlingSuccess,
    (state, { errorHandling }) => ({
      ...state,
      errorHandling: {
        ...errorHandlingAdapter.setAll(new ErrorHandlingBuilder(errorHandling)
          .filter(state.errorHandling.filters)
          .sort(state.errorHandling.sort)
          .get(), state.errorHandling),
        cached: errorHandling,
        loading: false,
        loaded: true
      }
    })
  ),
  on(SuperuserActions.loadErrorHandlingError,
    (state) => ({
      ...state,
      errorHandling: {
        ...state.errorHandling,
        loading: false,
        loaded: false
      }
    })
  ),
  on(SuperuserActions.filterErrorHandling,
    (state, { filters }) => {
      const { errorHandling } = state;
      const errorHandlingList = new ErrorHandlingBuilder(errorHandling.cached).filter(filters).get();
      return {
        ...state,
        errorHandling: {
          ...errorHandling,
          ...errorHandlingAdapter.setAll(errorHandlingList, state.errorHandling),
          filters
        }
      };
    }
  ),
  on(SuperuserActions.sortErrorHandling,
    (state, { sort }) => {
      const { errorHandling } = state;
      const errorHandlingList = new ErrorHandlingBuilder(errorHandling.cached).sort(sort).get();
      return {
        ...state,
        errorHandling: {
          ...errorHandling,
          ...errorHandlingAdapter.setAll(errorHandlingList, state.errorHandling),
          sort
        }
      };
    }
  ),
  on(SuperuserActions.loadAccessLog,
    (state) => ({
      ...state,
      accessLog: {
        ...state.accessLog,
        loading: true
      }
    })
  ),
  on(SuperuserActions.loadAccessLogSuccess,
    (state, { accessLog }) => {
      const initiallySorted = new AccessLogBuilder(accessLog)
        .sort(state.accessLog.sort)
        .filter(state.accessLog.filters).get();
      return {
        ...state,
        accessLog: {
          ...accessLogAdapter.setAll(initiallySorted, state.accessLog),
          cached: accessLog,
          loading: false,
          loaded: true
        }
      };
    }
  ),
  on(SuperuserActions.loadAccessLogError,
    (state) => ({
      ...state,
      accessLog: {
        ...state.accessLog,
        loading: false,
        loaded: false
      }
    })
  ),
  on(SuperuserActions.filterAccessLog,
    (state, { filters }) => {
      const { accessLog } = state;
      const accessLogList = new AccessLogBuilder(accessLog.cached)
        .sort(accessLog.sort)
        .filter(filters).get();
      return {
        ...state,
        accessLog: {
          ...accessLog,
          ...accessLogAdapter.setAll(accessLogList, state.accessLog),
          filters
        }
      };
    }
  ),
  on(SuperuserActions.sortAccessLog,
    (state, { sort }) => {
      const { accessLog } = state;
      const accessLogList = new AccessLogBuilder(accessLog.cached)
        .filter(accessLog.filters)
        .sort(sort).get();
      return {
        ...state,
        accessLog: {
          ...accessLog,
          ...accessLogAdapter.setAll(accessLogList, state.accessLog),
          sort
        }
      };
    }
  ),
  on(SuperuserActions.lockUserSuccess,
    (state, { user }) => {
      const { accessLog, accessManagement } = state;
      const accessLogBuilder = new AccessLogBuilder(accessLog.cached).lockUser(user._id);
      const accessManagementBuilder = new AccessManagementBuilder(accessManagement.cached).lockUser(user._id);
      const accessLogCached = accessLogBuilder.get();
      const accessManagementCached = accessManagementBuilder.get();
      const accessLogUpdated = accessLogBuilder.sort(accessLog.sort).filter(accessLog.filters).get();
      const accessManagementUpdated = accessManagementBuilder.sort(accessManagement.sort).filter(accessManagement.filters).get();
      return {
        ...state,
        accessLog: {
          ...accessLog,
          ...accessLogAdapter.setAll(accessLogUpdated, accessLog),
          cached: accessLogCached
        },
        accessManagement: {
          ...accessManagement,
          ...accessManagementAdapter.setAll(accessManagementUpdated, accessManagement),
          cached: accessManagementCached
        }
      };
    }
  ),
  on(SuperuserActions.unlockUserSuccess,
    (state, { user }) => {
      const { accessLog, accessManagement } = state;
      const accessLogBuilder = new AccessLogBuilder(accessLog.cached).unlockUser(user._id);
      const accessManagementBuilder = new AccessManagementBuilder(accessManagement.cached).unlockUser(user._id);
      const accessLogCached = accessLogBuilder.get();
      const accessManagementCached = accessManagementBuilder.get();
      const accessLogUpdated = accessLogBuilder.sort(accessLog.sort).filter(accessLog.filters).get();
      const accessManagementUpdated = accessManagementBuilder.sort(accessManagement.sort).filter(accessManagement.filters).get();
      return {
        ...state,
        accessLog: {
          ...accessLog,
          ...accessLogAdapter.setAll(accessLogUpdated, accessLog),
          cached: accessLogCached
        },
        accessManagement: {
          ...accessManagement,
          ...accessManagementAdapter.setAll(accessManagementUpdated, accessManagement),
          cached: accessManagementCached
        }
      };
    }
  ),
  on(SuperuserActions.deleteUserSuccess,
    (state, { id }) => {
      const { accessLog, accessManagement } = state;
      const accessLogBuilder = new AccessLogBuilder(accessLog.cached).deleteUser(id);
      const accessManagementBuilder = new AccessManagementBuilder(accessManagement.cached).deleteUser(id);
      const accessLogCached = accessLogBuilder.get();
      const accessManagementCached = accessManagementBuilder.get();
      const accessLogUpdated = accessLogBuilder.sort(accessLog.sort).filter(accessLog.filters).get();
      const accessManagementUpdated = accessManagementBuilder.sort(accessManagement.sort).filter(accessManagement.filters).get();
      return {
        ...state,
        accessLog: {
          ...accessLog,
          ...accessLogAdapter.setAll(accessLogUpdated, accessLog),
          cached: accessLogCached
        },
        accessManagement: {
          ...accessManagement,
          ...accessManagementAdapter.setAll(accessManagementUpdated, accessManagement),
          cached: accessManagementCached
        }
      };
    }
  ),
  on(SuperuserActions.destroySessionSuccess,
    (state, { id }) => {
      const { accessLog } = state;
      const accessLogUpdated = accessLog.cached.map(item => ({
        ...item,
        status: item._id === id ? AccessLogStatus.Offline : item.status
      }));
      const accessLogWrapped = new AccessLogBuilder(accessLogUpdated)
        .sort(accessLog.sort)
        .filter(accessLog.filters)
        .get();
      return {
        ...state,
        accessLog: {
          ...accessLog,
          ...accessLogAdapter.setAll(accessLogWrapped, accessLog),
          cached: accessLogUpdated
        }
      };
    }
  )
);

export const {
  selectIds: selectAccessManagementIds,
  selectEntities: selectAccessManagementEntities,
  selectAll: selectAccessManagementAll,
  selectTotal: selectAccessManagementTotal,
} = accessManagementAdapter.getSelectors();

export const {
  selectIds: selectErrorHandlingIds,
  selectEntities: selectErrorHandlingEntities,
  selectAll: selectErrorHandlingAll,
  selectTotal: selectErrorHandlingTotal,
} = errorHandlingAdapter.getSelectors();

export const {
  selectIds: selectAccessLogIds,
  selectEntities: selectAccessLogEntities,
  selectAll: selectAccessLogAll,
  selectTotal: selectAccessLogTotal,
} = accessLogAdapter.getSelectors();
