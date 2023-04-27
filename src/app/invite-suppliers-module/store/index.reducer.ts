import { createReducer, on } from '@ngrx/store';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { InvitationFilterPreview, InvitationStatus, InviteSuppliersTableModel } from '../invite-suppliers.model';
import * as InvitedSuppliersActions from './index.actions';
import { selectIdentifiableId } from '@abstract/identifiable';
import { InvitationFilterService } from '../services/invitationFilter.service';
export interface State {
  loaded: boolean;
  loading: boolean;
  allData: InviteSuppliersTableModel[];
  data: InviteSuppliersTableModel[];
  filterPreview: InvitationFilterPreview;
}

const adapter: EntityAdapter<any> = createEntityAdapter<any>();

export const searchesPreviewAdapter: EntityAdapter<any> = createEntityAdapter<any>({
  selectId: selectIdentifiableId
});

export const initialState: State = {
  loaded: false,
  loading: false,
  allData: [],
  data: [],
  filterPreview: {} as InvitationFilterPreview
};
export const reducer = createReducer(
  initialState,
  // DATA TABLE
  on(InvitedSuppliersActions.loadDataTable,
    (state) => {
      return ({
        ...state,
        loading: true
      });
    }
  ),
  on(InvitedSuppliersActions.loadDataTableSuccess,
    (state, { data }) => {
      const filterPreview = InvitationFilterService.setFilterPreview(data);
      return ({
        ...state,
        data,
        allData: data,
        filterPreview,
        loading: false,
        loaded: true
      });
    }
  ),
  on(InvitedSuppliersActions.loadDataTableError,
    (state) => {
      return ({
        ...state,
        loading: false,
        loaded: false
      });
    }
  ),
  on(InvitedSuppliersActions.setStatus,
    (state, { element, status }) => {
      const mutateDate = (arr: InviteSuppliersTableModel[]) => {
        return arr.map(elem => {
          const entity = Object.assign({}, elem);
          if (entity._id === element._id) {
            entity.status = status;
            if (status === InvitationStatus.ONBOARDED) {
              entity.dateOnboarded = new Date();
            }
          }
          return entity;
        });
      };
      return ({
        ...state,
        data: mutateDate(state.data),
        allData: mutateDate(state.allData)
      });
    }
  ),

  // FILTERS
  on(InvitedSuppliersActions.setFilter,
    (state, { filter }) => {
      const data = InvitationFilterService.getFilteredData(filter, state.allData);
      const filterPreview = InvitationFilterService.setFilterPreview(state.allData);
      return ({
        ...state,
        data,
        filterPreview
      });
    }
  ),
  on(InvitedSuppliersActions.loadFilter,
    (state) => {
      return ({
        ...state,
      });
    }
  ),
);

export const {
  selectAll,
} = adapter.getSelectors();

