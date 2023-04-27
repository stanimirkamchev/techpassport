import { createAction, props } from '@ngrx/store';

// import { Table } from './editTables.model';

// loadTables
export const loadTable = createAction(
  '[Table/API] Load Table',
  props<{ table: string }>()
);

export const loadTableTags = createAction(
  '[Table/API] Load Table Tags',
  props<{ table: 'tags' }>()
);

export const loadTableFrameworks = createAction(
  '[Table/API] Load Table Frameworks',
  props<{ table: 'frameworks' }>()
);

export const loadTableSolutions = createAction(
  '[Table/API] Load Table Solutions',
  props<{ table: 'solutions' }>()
);

export const loadTableTaxonomies = createAction(
  '[Table/API] Load Table Taxonomies',
  props<{ table: 'taxonomies' }>()
);


export const loadTableTagsSuccess = createAction(
  '[Table/API] Load Table Tags Success',
  props<{ table: [] }>()
);

export const loadTableFrameworkSuccess = createAction(
  '[Table/API] Load Table Framework Success',
  props<{ table: [] }>()
);

export const loadTableSolutionSuccess = createAction(
  '[Table/API] Load Table Solution Success',
  props<{ table: [] }>()
);

export const loadTableTaxonomySuccess = createAction(
  '[Table/API] Load Table Taxonomies Success',
  props<{ table: [] }>()
);

export const loadTableSuccess = createAction(
  '[Table/API] Load Table Success',
  props<{ table: string, tableName: string }>()
);

export const loadTableError = createAction(
  '[Table/API] Load Table Error',
  props<{ error: any }>()
);

export const editTable = createAction(
  '[Table/API] Edit Table',
  props<{ table: string,  entity: any }>()
);

