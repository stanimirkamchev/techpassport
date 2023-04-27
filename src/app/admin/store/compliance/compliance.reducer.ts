import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Compliance, ComplianceFilters, ComplianceDetails, ComplianceBuilder } from './compliance.model';
import * as ComplianceActions from './compliance.actions';
import { Sort } from '@angular/material/sort';
import { TypedAction } from '@ngrx/store/src/models';

export const compliancesFeatureKey = 'compliances';

const selectComplianceId = (compliance: Compliance) => compliance._id;

export interface State extends EntityState<Compliance> {
  sort?: Sort;
  loaded: boolean;
  loading: boolean;
  cached: Compliance[];
  filters: ComplianceFilters;
  details: {
    item: ComplianceDetails;
    loaded: boolean;
    loading: boolean;
  };
}

export const adapter: EntityAdapter<Compliance> = createEntityAdapter<Compliance>({
  selectId: selectComplianceId,
});

export const initialState: State = adapter.getInitialState({
  loaded: false,
  loading: false,
  cached: [],
  filters: {},
  details: {
    item: {} as ComplianceDetails,
    loaded: false,
    loading: false,
  }
});

export const reducer = createReducer(
  initialState,
  on(ComplianceActions.loadCompliances,
    (state) => ({
      ...state,
      loading: true
    })
  ),
  on(ComplianceActions.loadCompliancesSuccess,
    (state, { compliances }) => ({
      ...adapter.setAll(compliances, state),
      cached: compliances,
      loading: false,
      loaded: true
    })
  ),
  on(ComplianceActions.loadCompliancesError,
    (state) => ({
      ...state,
      loading: false,
      loaded: false
    })
  ),
  on(
    ComplianceActions.sortCompliances,
    ComplianceActions.filterCompliances,
    (state, action) => {
      const products = new ComplianceBuilder(state.cached)
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
  on(ComplianceActions.loadComplianceDetails,
    (state) => ({
      ...state,
      details: {
        ...state.details,
        loading: true
      }
    })
  ),
  on(ComplianceActions.loadComplianceDetailsSuccess,
    (state, action) => ({
      ...state,
      details: {
        ...state.details,
        loading: false,
        loaded: true,
        item: action.complianceDetails
      }
    })
  ),
  on(ComplianceActions.loadComplianceDetailsError,
    (state) => ({
      ...state,
      details: {
        ...state.details,
        loading: false,
        loaded: false
      }
    })
  )
);

const isFilterType = (action): action is TypedAction<'[Compliance/API] Filter Compliances'> => {
  return !action.sort;
};

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
