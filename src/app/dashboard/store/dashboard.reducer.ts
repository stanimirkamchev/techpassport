import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { DashboardFilters, DashboardKPIs, DashboardAlerts, DashboardSecurityTrends, DashboardProject, DashboardResources, DashboardProjectFilters,
          ProjectsBuilder, MarketPreview, SearchesPreview, TechnologyPreview, TrendsPreview, MarketPreviewBuilder, SearchesPreviewBuilder,
          TechnologyPreviewBuilder, TrendsPreviewBuilder, BankShortlistItem, DashboardResourceUser, Suppliers } from './dashboard.model';
import { selectIdentifiableId } from '@abstract/identifiable';
import * as fromDashboard from './dashboard.actions';
import { Sort } from '@angular/material/sort';
import { LineChart } from '../../shared/chart-line/chart-line.component';


export interface ProjectsState extends EntityState<DashboardProject> {
  loaded: boolean;
  loading: boolean;
  sort?: Sort;
  cached: DashboardProject[];
  filters: DashboardProjectFilters;
}

export const projectsAdapter: EntityAdapter<DashboardProject> = createEntityAdapter<DashboardProject>({
  selectId: selectIdentifiableId
});

export const marketPreviewAdapter: EntityAdapter<MarketPreview> = createEntityAdapter<MarketPreview>({
  selectId: selectIdentifiableId
});

export const searchesPreviewAdapter: EntityAdapter<SearchesPreview> = createEntityAdapter<SearchesPreview>({
  selectId: selectIdentifiableId
});

export const technologyPreviewAdapter: EntityAdapter<TechnologyPreview> = createEntityAdapter<TechnologyPreview>({
  selectId: selectIdentifiableId
});

export const trendsPreviewAdapter: EntityAdapter<TrendsPreview> = createEntityAdapter<TrendsPreview>({
  selectId: selectIdentifiableId
});

export const suppliersAdapter: EntityAdapter<Suppliers> = createEntityAdapter<Suppliers>({
  selectId: selectIdentifiableId
});

export interface PreviewState<T> extends EntityState<T> {
  loading: boolean;
  loaded: boolean;
  sort?: Sort;
  cached: T[];
}

export interface State {
  loaded: boolean;
  loading: boolean;
  filters: DashboardFilters;
  banksShortlist: {
    list: BankShortlistItem[];
    selected?: string;
    loading: boolean;
    loaded: boolean;
  };
  preview: {
    market: PreviewState<MarketPreview>;
    searches: PreviewState<SearchesPreview>;
    technology: PreviewState<TechnologyPreview>;
    trends: PreviewState<TrendsPreview>;
  };
  kpis: {
    item: DashboardKPIs;
    loaded: boolean;
    loading: boolean;
  };
  alerts: {
    item: DashboardAlerts;
    loaded: boolean;
    loading: boolean;
  };
  trends: {
    item: DashboardSecurityTrends;
    loaded: boolean;
    loading: boolean;
  };
  projects: ProjectsState;
  resources: {
    item: DashboardResources;
    selectedUsers: DashboardResourceUser[];
    usersChartData?: any;
    loaded: boolean;
    loading: boolean;
  };
  products: {
    item: any;
    loaded: boolean;
    loading: boolean;
  };
  favoriteProducts: {
    item: any;
    loaded: boolean;
    loading: boolean;
  };
  favoriteProductsCount: 0;
  favoriteProductsIds: [];
}

export const initialState: State = {
  loaded: false,
  loading: false,
  filters: {},
  banksShortlist: {
    loaded: false,
    loading: false,
    list: []
  },
  preview: {
    market: marketPreviewAdapter.getInitialState({
      loaded: false,
      loading: false,
      cached: []
    }),
    searches: searchesPreviewAdapter.getInitialState({
      loaded: false,
      loading: false,
      cached: []
    }),
    technology: technologyPreviewAdapter.getInitialState({
      loaded: false,
      loading: false,
      cached: []
    }),
    trends: trendsPreviewAdapter.getInitialState({
      loaded: false,
      loading: false,
      cached: []
    })
  },
  kpis: {
    item: {} as DashboardKPIs,
    loaded: false,
    loading: false
  },
  alerts: {
    item: {} as DashboardAlerts,
    loaded: false,
    loading: false,
  },
  trends: {
    item: {} as DashboardSecurityTrends,
    loaded: false,
    loading: false,
  },
  projects: projectsAdapter.getInitialState({
    loaded: false,
    loading: false,
    cached: [],
    filters: {}
  }),
  resources: {
    item: {} as DashboardResources,
    selectedUsers: [],
    loaded: false,
    loading: false,
  },
  products: {
    item: {},
    loaded: false,
    loading: false,
  },
  favoriteProducts: {
    item: {},
    loaded: false,
    loading: false,
  },
  favoriteProductsCount: 0,
  favoriteProductsIds: []
};

export const reducer = createReducer(
  initialState,
  on(fromDashboard.loadDashboard,
    (state) => ({
      ...state,
      loading: true
    })
  ),
  on(fromDashboard.loadDashboardSuccess,
    (state, action) => ({
      ...state,
      loading: false,
      loaded: true
    })
  ),
  on(fromDashboard.loadDashboardError,
    (state) => ({
      ...state,
      loading: false,
      loaded: false
    })
  ),
  on(fromDashboard.loadBanksShortlist,
    (state) => ({
      ...state,
      banksShortlist: {
        ...state.banksShortlist,
        loading: true
      }
    })
  ),
  on(fromDashboard.loadBanksShortlistSuccess,
    (state, { banksShortlist }) => ({
      ...state,
      banksShortlist: {
        ...state.banksShortlist,
        loading: false,
        loaded: true,
        selected: banksShortlist[0]._id,
        list: banksShortlist
      }
    })
  ),
  on(fromDashboard.loadBanksShortlistError,
    (state) => ({
      ...state,
      banksShortlist: {
        ...state.banksShortlist,
        loading: false,
        loaded: false
      }
    })
  ),
  on(fromDashboard.loadKPIs,
    (state) => ({
      ...state,
      kpis: {
        ...state.kpis,
        loading: true
      }
    })
  ),
  on(fromDashboard.loadKPIsSuccess,
    (state, { kpis }) => ({
      ...state,
      kpis: {
        ...state.kpis,
        item: kpis,
        loading: false,
        loaded: true
      }
    })
  ),
  on(fromDashboard.loadKPIsError,
    (state) => ({
      ...state,
      kpis: {
        ...state.kpis,
        loading: false,
        loaded: false
      }
    })
  ),
  on(fromDashboard.loadAlerts,
    (state) => ({
      ...state,
      alerts: {
        ...state.alerts,
        loading: true
      }
    })
  ),
  on(fromDashboard.loadAlertsSuccess,
    (state, { alerts }) => ({
      ...state,
      alerts: {
        ...state.alerts,
        item: alerts,
        loading: false,
        loaded: true
      }
    })
  ),
  on(fromDashboard.loadAlertsError,
    (state) => ({
      ...state,
      alerts: {
        ...state.alerts,
        loading: false,
        loaded: false
      }
    })
  ),
  on(fromDashboard.loadTrends,
    (state) => ({
      ...state,
      trends: {
        ...state.trends,
        loading: true
      }
    })
  ),
  on(fromDashboard.loadTrendsSuccess,
    (state, { trends }) => ({
      ...state,
      trends: {
        ...state.trends,
        item: trends,
        loading: false,
        loaded: true
      }
    })
  ),
  on(fromDashboard.loadTrendsError,
    (state) => ({
      ...state,
      trends: {
        ...state.trends,
        loading: false,
        loaded: false
      }
    })
  ),
  on(fromDashboard.loadProjects,
    (state) => ({
      ...state,
      projects: {
        ...state.projects,
        loading: true
      }
    })
  ),
  on(fromDashboard.loadProjectsSuccess,
    (state, { projects }) => ({
      ...state,
      projects: {
        ...projectsAdapter.setAll(projects, state.projects),
        cached: projects,
        loading: false,
        loaded: true
      }
    })
  ),
  on(fromDashboard.loadProjectsError,
    (state) => ({
      ...state,
      projects: {
        ...state.projects,
        loading: false,
        loaded: false
      }
    })
  ),
  on(fromDashboard.filterProjects,
    (state, { filters }) => {
      const { projects } = state;
      const projectsList = new ProjectsBuilder(projects.cached)
        .sort(projects.sort)
        .filter(filters).get();
      return {
        ...state,
        projects: {
          ...projects,
          ...projectsAdapter.setAll(projectsList, state.projects),
          filters
        }
      };
    }
  ),
  on(fromDashboard.sortProjects,
    (state, { sort }) => {
      const { projects } = state;
      const projectsList = new ProjectsBuilder(projects.cached)
        .filter(projects.filters)
        .sort(sort).get();
      return {
        ...state,
        projects: {
          ...projects,
          ...projectsAdapter.setAll(projectsList, state.projects),
          sort
        }
      };
    }
  ),
  on(fromDashboard.loadResources,
    (state) => ({
      ...state,
      resources: {
        ...state.resources,
        loading: true
      }
    })
  ),
  on(fromDashboard.loadResourcesSuccess,
    (state, { resources }) => ({
      ...state,
      resources: {
        ...state.resources,
        item: resources,
        loading: false,
        loaded: true
      }
    })
  ),
  on(fromDashboard.loadResourcesError,
    (state) => ({
      ...state,
      resources: {
        ...state.resources,
        loading: false,
        loaded: false
      }
    })
  ),
  on(fromDashboard.setResourcesUsers,
    (state, { users }) => {
      const selectedUsers = state.resources.item.users.filter(({ _id }) => users.indexOf(_id) > -1);
      return {
        ...state,
        resources: {
          ...state.resources,
          selectedUsers,
          usersChartData: {
            data: {
              labels: selectedUsers.map(u => u.name),
              datasets: selectedUsers.map(u => ({
                data: u.data.total,
                label: u.name
              }))
            }
          }
        }
      };
    }
  ),
  on(fromDashboard.loadMarketPreview,
    (state) => ({
      ...state,
      preview: {
        ...state.preview,
        market: {
          ...state.preview.market,
          loading: true
        }
      }
    })
  ),
  on(fromDashboard.loadMarketPreviewSuccess,
    (state, { preview }) => ({
      ...state,
      preview: {
        ...state.preview,
        market: {
          ...state.preview.market,
          ...marketPreviewAdapter.setAll(preview, state.preview.market),
          cached: preview,
          loading: false,
          loaded: true
        }
      }
    })
  ),
  on(fromDashboard.loadMarketPreviewError,
    (state) => ({
      ...state,
      preview: {
        ...state.preview,
        market: {
          ...state.preview.market,
          loading: false,
          loaded: false
        }
      }
    })
  ),
  on(fromDashboard.sortMarketPreview,
    (state, { sort }) => {
      const { market } = state.preview;
      const marketPreviewList = new MarketPreviewBuilder(market.cached).sort(sort).get();
      return {
        ...state,
        preview: {
          ...state.preview,
          market: {
            ...state.preview.market,
            ...marketPreviewAdapter.setAll(marketPreviewList, state.preview.market),
            sort
          }
        }
      };
    }
  ),
  on(fromDashboard.loadSearchesPreview,
    (state) => ({
      ...state,
      preview: {
        ...state.preview,
        searches: {
          ...state.preview.searches,
          loading: true
        }
      }
    })
  ),
  on(fromDashboard.loadSearchesPreviewSuccess,
    (state, { preview }) => ({
      ...state,
      preview: {
        ...state.preview,
        searches: {
          ...state.preview.searches,
          ...searchesPreviewAdapter.setAll(preview, state.preview.searches),
          cached: preview,
          loading: false,
          loaded: true
        }
      }
    })
  ),
  on(fromDashboard.loadSearchesPreviewError,
    (state) => ({
      ...state,
      preview: {
        ...state.preview,
        searches: {
          ...state.preview.searches,
          loading: false,
          loaded: false
        }
      }
    })
  ),
  on(fromDashboard.sortSearchesPreview,
    (state, { sort }) => {
      const { searches } = state.preview;
      const searchesPreviewList = new SearchesPreviewBuilder(searches.cached).sort(sort).get();
      return {
        ...state,
        preview: {
          ...state.preview,
          searches: {
            ...state.preview.searches,
            ...searchesPreviewAdapter.setAll(searchesPreviewList, state.preview.searches),
            sort
          }
        }
      };
    }
  ),
  on(fromDashboard.loadTechnologyPreview,
    (state) => ({
      ...state,
      preview: {
        ...state.preview,
        technology: {
          ...state.preview.technology,
          loading: true
        }
      }
    })
  ),
  on(fromDashboard.loadTechnologyPreviewSuccess,
    (state, { preview }) => ({
      ...state,
      preview: {
        ...state.preview,
        technology: {
          ...state.preview.technology,
          ...technologyPreviewAdapter.setAll(preview, state.preview.technology),
          cached: preview,
          loading: false,
          loaded: true
        }
      }
    })
  ),
  on(fromDashboard.loadTechnologyPreviewError,
    (state) => ({
      ...state,
      preview: {
        ...state.preview,
        technology: {
          ...state.preview.technology,
          loading: false,
          loaded: false
        }
      }
    })
  ),
  on(fromDashboard.sortTechnologyPreview,
    (state, { sort }) => {
      const { technology } = state.preview;
      const technologyPreviewList = new TechnologyPreviewBuilder(technology.cached).sort(sort).get();
      return {
        ...state,
        preview: {
          ...state.preview,
          technology: {
            ...state.preview.technology,
            ...technologyPreviewAdapter.setAll(technologyPreviewList, state.preview.technology),
            sort
          }
        }
      };
    }
  ),
  on(fromDashboard.loadTrendsPreview,
    (state) => ({
      ...state,
      preview: {
        ...state.preview,
        trends: {
          ...state.preview.trends,
          loading: true
        }
      }
    })
  ),
  on(fromDashboard.loadTrendsPreviewSuccess,
    (state, { preview }) => ({
      ...state,
      preview: {
        ...state.preview,
        trends: {
          ...state.preview.trends,
          ...trendsPreviewAdapter.setAll(preview, state.preview.trends),
          cached: preview,
          loading: false,
          loaded: true
        }
      }
    })
  ),
  on(fromDashboard.loadTrendsPreviewError,
    (state) => ({
      ...state,
      preview: {
        ...state.preview,
        trends: {
          ...state.preview.trends,
          loading: false,
          loaded: false
        }
      }
    })
  ),
  on(fromDashboard.sortTrendsPreview,
    (state, { sort }) => {
      const { trends } = state.preview;
      const trendsPreviewList = new TrendsPreviewBuilder(trends.cached).sort(sort).get();
      return {
        ...state,
        preview: {
          ...state.preview,
          trends: {
            ...state.preview.trends,
            ...trendsPreviewAdapter.setAll(trendsPreviewList, state.preview.trends),
            sort
          }
        }
      };
    }
  ),
  on(fromDashboard.loadProducts,
    (state) => ({
      ...state,
      products: {
        ...state.products,
        loading: true,
        loaded: false
      }
    })
  ),
  on(fromDashboard.loadProductsSuccess,
    (state, { products }) => ({
      ...state,
      products: {
        ...state.products,
        item: products,
        loading: false,
        loaded: true
      }
    })
  ),
  on(fromDashboard.loadProductsError,
    (state) => ({
      ...state,
      products: {
        ...state.products,
        loading: false,
        loaded: false
      }
    })
  ),
  on(fromDashboard.loadFavoriteProducts,
    (state) => ({
      ...state,
      favoriteProducts: {
        ...state.favoriteProducts,
        loading: true,
        loaded: false
      },
    })
  ),
  on(fromDashboard.loadFavoriteProductsSuccess,
    (state, { favoriteProducts }) => ({
      ...state,
      favoriteProducts: {
        ...state.favoriteProducts,
        item: favoriteProducts,
        loading: false,
        loaded: true
      },
      favoriteProductsCount: favoriteProducts.length,
      favoriteProductsIds: favoriteProducts.map((i:any) => i.product?._id),
    })
  ),
  on(fromDashboard.loadFavoriteProductsError,
    (state) => ({
      ...state,
      favoriteProducts: {
        ...state.favoriteProducts,
        loading: false,
        loaded: false
      }
    })
  ),
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = projectsAdapter.getSelectors();

export const {
  selectIds: selectMarketPreviewIds,
  selectEntities: selectMarketPreviewEntities,
  selectAll: selectMarketPreviewAll,
  selectTotal: selectMarketPreviewTotal,
} = marketPreviewAdapter.getSelectors();

export const {
  selectIds: selectTechnologyPreviewIds,
  selectEntities: selectTechnologyPreviewEntities,
  selectAll: selectTechnologyPreviewAll,
  selectTotal: selectTechnologyPreviewTotal,
} = technologyPreviewAdapter.getSelectors();

export const {
  selectIds: selectSearchesPreviewIds,
  selectEntities: selectSearchesPreviewEntities,
  selectAll: selectSearchesPreviewAll,
  selectTotal: selectSearchesPreviewTotal,
} = searchesPreviewAdapter.getSelectors();

export const {
  selectIds: selectTrendsPreviewIds,
  selectEntities: selectTrendsPreviewEntities,
  selectAll: selectTrendsPreviewAll,
  selectTotal: selectTrendsPreviewTotal,
} = trendsPreviewAdapter.getSelectors();
