import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { Table } from './editTables.model';
import * as editTables from './editTables.actions';

export const editTablesFeatureKey = 'editTables';

const tableId = (table: any) => {
return table._id
}

export interface State {
  loaded: boolean;
  loading: boolean;
  tags: any;
  taxonomies: any;
  solutions: any;
  frameworks: any;
}

export const adapter: EntityAdapter<Table> = createEntityAdapter<Table>({
  selectId: tableId
});

export let initialState: any = adapter.getInitialState({
  loaded: false,
  loading: false,
  tags: [],
  taxonomies: [],
  solutions: [],
  frameworks: [],
  ids: [],
  entities: [],
});

export class EditTablesReducer {
  static loadTable(state: any): any {
    return {
      ...state,
      loading: true
    };
  }

  static loadTableSuccess(state: any, payload: any): any {
    console.log('state', state);
    console.log('loadTableSuccess', payload);
    let tags = [];
    let frameworks = [];
    switch (payload.tableName) {
      case 'tags':
        tags = payload.table;
        break;
      case 'taxonomies':
        state.taxonomies = payload.table;
        break;
      case 'solutions':
        state.solutions = [...state.solutions, Object.assign({}, payload.table)];
        break;
      case 'frameworks':
        frameworks = payload.table;
        break;
      default:
        break;
    }
    return {
      loaded: false,
      loading: true,
      tags,
      taxonomies: [],
      solutions: [],
      frameworks
    };
  }
}

export const reducer = createReducer(
  initialState,
  on(editTables.loadTable,
    (state) => ({
      ...state,
      loading: true
    })
  ),
  on(editTables.loadTableTagsSuccess,
    (state, action) => ({
      ...adapter.setAll(action.table, state),
      tags: action.table,
      loading: false,
      loaded: true
    })
  ),
  on(editTables.loadTableFrameworkSuccess,
    (state, action) => ({
      ...adapter.setAll(action.table, state),
      frameworks: action.table,
      loading: false,
      loaded: true
    })
  ),
  on(editTables.loadTableSolutionSuccess,
    (state, action) => ({
      ...adapter.setAll(action.table, state),
      solutions: action.table,
      loading: false,
      loaded: true
    })
  ),
  on(editTables.loadTableTaxonomySuccess,
    (state, action) => ({
      ...adapter.setAll(action.table, state),
      taxonomies: action.table,
      loading: false,
      loaded: true
    })
  ),
  on(editTables.loadTableSuccess,
    (state, action) => EditTablesReducer.loadTableSuccess(state, action)
  ),
  on(editTables.loadTableError,
    (state) => ({
      ...state,
      loading: false,
      loaded: false
    })
  ),
);

export const {
  selectAll,
} = adapter.getSelectors();
