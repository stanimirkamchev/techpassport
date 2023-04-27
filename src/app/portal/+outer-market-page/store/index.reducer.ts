import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { OuterMarketTableModel } from '../outerMarket.models';
import * as OuterMarketActions from './index.actions';
import { selectIdentifiableId } from '@abstract/identifiable';

export interface State {
  loaded: boolean;
  loading: boolean;
  data: OuterMarketTableModel[];
  preview: any;
}

const adapter: EntityAdapter<any> = createEntityAdapter<any>();

export const searchesPreviewAdapter: EntityAdapter<any> = createEntityAdapter<any>({
  selectId: selectIdentifiableId
});

export const initialState: State = {
  loaded: false,
  loading: false,
  data: [],
  preview: {
    loaded: false,
    loading: false,
    all: [],
    companies: []
  }
};
export const reducer = createReducer(
  initialState,
  on(OuterMarketActions.loadDataTable,
    (state) => {
      return ({
        ...state,
        loading: true
      });
    }
  ),
  on(OuterMarketActions.loadDataTableSuccess,
    (state, { data }) => {
      return ({
        ...state,
        data,
        loading: false,
        loaded: true
      });
    }
  ),
  on(OuterMarketActions.loadDataTableError,
    (state) => {
      return ({
        ...state,
        loading: false,
        loaded: false
      });
    }
  ),
  on(OuterMarketActions.loadSearchesPreview,
    (state) => ({
      ...state,
      preview: {
        all: [],
        companies: [],
        loading: true,
      },
    })
  ),
  
  on(OuterMarketActions.loadSearchesPreviewSuccess,
    (state, { preview }) => {
      return ({
        ...state,
        preview: !preview ? {
          all: [],
          companies: [],
          loading: false
        } : preview 
      })
    } 
  ),

  on(OuterMarketActions.loadSearchesPreviewError,
    (state) => ({
      ...state,
      preview: {
        ...state.preview.all,
        ...state.preview.companies,
        loading: false,
        loaded: false
      }
    })
  ),
);

export const {
  selectAll,
} = adapter.getSelectors();

