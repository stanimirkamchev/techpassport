import { createSelector } from '@ngrx/store';
import { selectAdminState } from '..';
import * as editTables from './editTables.reducer';


export const editTablesState = createSelector(
  selectAdminState,
  state => state[editTables.editTablesFeatureKey]
);

export const selectTables = createSelector(
   // @ts-ignore
  editTablesState, //TODO:
  editTables.selectAll
);

export const editTablesTagsLoading = createSelector(
  editTablesState,
  state => state.loading
);

export const editTablesTagsLoaded = createSelector(
  editTablesState,
  state => state.loaded
);

export const editTablesFrameworksLoading = createSelector(
  editTablesState,
  state => state.loading
);

export const editTablesFrameworksLoaded = createSelector(
  editTablesState,
  state => state.loaded
);

export const editTablesSolutionsLoading = createSelector(
  editTablesState,
  state => state.loading
);

export const editTablesSolutionsLoaded = createSelector(
  editTablesState,
  state => state.loaded
);

export const editTablesTaxonomiesLoading = createSelector(
  editTablesState,
  state => state.loading
);

export const editTablesTaxonomiesLoaded = createSelector(
  editTablesState,
  state => state.loaded
);


export const editTablesLoading = createSelector(
  editTablesState,
  state => state.loading
);

export const editTablesLoaded = createSelector(
  editTablesState,
  state => state.loaded
);


