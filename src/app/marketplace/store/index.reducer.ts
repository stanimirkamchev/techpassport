import { createReducer, on } from '@ngrx/store';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as MarketplaceActions from './index.actions';
import { selectIdentifiableId } from '@abstract/identifiable';

export interface State {
  loaded: boolean;
  loading: boolean;
  data: any[];
  preview: any;
}

const adapter: EntityAdapter<any> = createEntityAdapter<any>();

// export const searchesPreviewAdapter: EntityAdapter<any> = createEntityAdapter<any>({
//   selectId: selectIdentifiableId
// });

export const initialState: State = {
  loaded: false,
  loading: false,
  data: [],
  preview: {
    loaded: false,
    loading: false,
  }
};

export const reducer = createReducer(
  initialState,
  on(MarketplaceActions.loadDataTable,
    (state) => {
      return ({
        ...state,
        loading: true
      });
    }
  ),
  on(MarketplaceActions.loadDataTableSuccess,
    (state, { data }) => {
      return ({
        ...state,
        data,
        loading: false,
        loaded: true
      });
    }
  ),
  on(MarketplaceActions.loadDataTableError,
    (state) => {
      return ({
        ...state,
        loading: false,
        loaded: false
      });
    }
  ),
  on(MarketplaceActions.addWatchlistCount,
    (state, { data }) => {
      const records = state.data.map((a: any) => {
        const obj = Object.assign({}, a);
        if (data.find(d => a._id === d)) {
          obj.watchlistsCount += 1;
        }
        return obj;
      });

      return ({
        ...state,
        data: [...records],
        loading: true,
        loaded: false
      });
    }
  ),

  on(MarketplaceActions.addWatchlistCountSuccess,
    (state, { }) => {
      return ({
        ...state,
        loading: false,
        loaded: true
      });
    }
  ),
);

export const {
  selectAll,
} = adapter.getSelectors();

