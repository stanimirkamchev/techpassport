import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// import { OuterMarketTableModel } from '../outerMarket.models';
import * as ERQActions from './index.actions';
import { selectIdentifiableId } from '@abstract/identifiable';
import { IErqDto } from '../models/erq-dto';

export interface State {
  loaded: boolean;
  loading: boolean;
  data: IErqDto;
}

const adapter: EntityAdapter<any> = createEntityAdapter<any>();

// export const searchesPreviewAdapter: EntityAdapter<any> = createEntityAdapter<any>({
//   selectId: selectIdentifiableId
// });

export const initialState: State = {
  loaded: false,
  loading: false,
  data: {} as IErqDto,
};
export const reducer = createReducer(
  initialState,
  on(ERQActions.loadDataTable,
    (state) => {
      return ({
        ...state,
        loading: true
      });
    }
  ),
  on(ERQActions.loadDataTableSuccess,
    (state, { data }) => {
      return ({
        ...state,
        data,
        loading: false,
        loaded: true
      });
    }
  ),
  on(ERQActions.loadDataTableError,
    (state) => {
      return ({
        ...state,
        loading: false,
        loaded: false
      });
    }
  )
);

export const {
  selectAll,
} = adapter.getSelectors();

