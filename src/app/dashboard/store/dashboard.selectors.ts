import { createSelector } from '@ngrx/store';
import * as fromDashboard from './';
import { State, selectAll, selectMarketPreviewAll, selectSearchesPreviewAll, selectTechnologyPreviewAll, selectTrendsPreviewAll } from './dashboard.reducer';

export const selectDashboardState = createSelector(
  fromDashboard.selectDashboardState,
  state => state
);

export const selectDashboardLoading = createSelector(
  selectDashboardState,
  state => state.loading
);

export const selectDashboardLoaded = createSelector(
  selectDashboardState,
  state => state.loaded
);

// banks shortlist
export const selectDashboardBankShortlistState = createSelector(
  selectDashboardState,
  state => state.banksShortlist
);

export const selectDashboardBankShortlist = createSelector(
  selectDashboardBankShortlistState,
  state => state.list
);

export const selectDashboardBankShortlistLoading = createSelector(
  selectDashboardBankShortlistState,
  state => state.loading
);

export const selectDashboardBankShortlistLoaded = createSelector(
  selectDashboardBankShortlistState,
  state => state.loaded
);

export const selectDashboardBankShortlistSelected = createSelector(
  selectDashboardBankShortlistState,
  state => state.selected
);


// kpis
export const selectDashboardKpisState = createSelector(
  selectDashboardState,
  state => state.kpis
);

export const selectDashboardKpis = createSelector(
  selectDashboardKpisState,
  state => state.item
);

export const selectDashboardKpisLoading = createSelector(
  selectDashboardKpisState,
  state => state.loading
);

export const selectDashboardKpisLoaded = createSelector(
  selectDashboardKpisState,
  state => state.loaded
);


// alerts
export const selectDashboardAlertsState = createSelector(
  selectDashboardState,
  state => state.alerts
);

export const selectDashboardAlerts = createSelector(
  selectDashboardAlertsState,
  state => state.item
);

export const selectDashboardAlertsLoading = createSelector(
  selectDashboardAlertsState,
  state => state.loading
);

export const selectDashboardAlertsLoaded = createSelector(
  selectDashboardAlertsState,
  state => state.loaded
);


// trends
export const selectDashboardTrendsState = createSelector(
  selectDashboardState,
  state => state.trends
);

export const selectDashboardTrends = createSelector(
  selectDashboardTrendsState,
  state => state.item
);

export const selectDashboardTrendsLoading = createSelector(
  selectDashboardTrendsState,
  state => state.loading
);

export const selectDashboardTrendsLoaded = createSelector(
  selectDashboardTrendsState,
  state => state.loaded
);


// projects
export const selectDashboardProjectsState = createSelector(
  selectDashboardState,
  state => state.projects
);

export const selectDashboardProjects = createSelector(
  selectDashboardProjectsState,
  selectAll
);

export const selectDashboardProjectsLoading = createSelector(
  selectDashboardProjectsState,
  state => state.loading
);

export const selectDashboardProjectsLoaded = createSelector(
  selectDashboardProjectsState,
  state => state.loaded
);


// resources
export const selectDashboardResourcesState = createSelector(
  selectDashboardState,
  state => state.resources
);

export const selectDashboardResources = createSelector(
  selectDashboardResourcesState,
  state => state.item
);

export const selectDashboardResourcesUsersChartData = createSelector(
  selectDashboardResourcesState,
  state => state.usersChartData
);

export const selectDashboardResourcesLoading = createSelector(
  selectDashboardResourcesState,
  state => state.loading
);

export const selectDashboardResourcesLoaded = createSelector(
  selectDashboardResourcesState,
  state => state.loaded
);


// preview
export const selectPreviewState = createSelector(
  selectDashboardState,
  state => state.preview
);

// market preview
export const selectMarketPreviewState = createSelector(
  selectPreviewState,
  state => state.market
);

export const selectMarketPreview = createSelector(
  selectMarketPreviewState,
  selectMarketPreviewAll
);

export const selectMarketPreviewLoading = createSelector(
  selectMarketPreviewState,
  state => state.loading
);

export const selectMarketPreviewLoaded = createSelector(
  selectMarketPreviewState,
  state => state.loaded
);

// searches preview
export const selectSearchesPreviewState = createSelector(
  selectPreviewState,
  state => state.searches
);

export const selectSearchesPreview = createSelector(
  selectSearchesPreviewState,
  selectSearchesPreviewAll
);

export const selectSearchesPreviewLoading = createSelector(
  selectSearchesPreviewState,
  state => state.loading
);

export const selectSearchesPreviewLoaded = createSelector(
  selectSearchesPreviewState,
  state => state.loaded
);

// technology preview
export const selectTechnologyPreviewState = createSelector(
  selectPreviewState,
  state => state.technology
);

export const selectTechnologyPreview = createSelector(
  selectTechnologyPreviewState,
  selectTechnologyPreviewAll
);

export const selectTechnologyPreviewLoading = createSelector(
  selectTechnologyPreviewState,
  state => state.loading
);

export const selectTechnologyPreviewLoaded = createSelector(
  selectTechnologyPreviewState,
  state => state.loaded
);

// trends preview
export const selectTrendsPreviewState = createSelector(
  selectPreviewState,
  state => state.trends
);

export const selectTrendsPreview = createSelector(
  selectTrendsPreviewState,
  selectTrendsPreviewAll
);

export const selectTrendsPreviewLoading = createSelector(
  selectTrendsPreviewState,
  state => state.loading
);

export const selectTrendsPreviewLoaded = createSelector(
  selectTrendsPreviewState,
  state => state.loaded
);

// Suppliers
export const selectDashboardProductsState = createSelector(
  selectDashboardState,
  state => state.products
);

export const selectDashboardProducts = createSelector(
  selectDashboardProductsState,
  state => state.item
);

export const selectDashboardProductsLoading = createSelector(
  selectDashboardProductsState,
  state => state.loading
);

export const selectDashboardProductsLoaded = createSelector(
  selectDashboardProductsState,
  state => state.loaded
);


// Favorite Suppliers
export const selectDashboardFavoriteProductsState = createSelector(
  selectDashboardState,
  state => state.favoriteProducts
);

export const selectDashboardFavoriteProducts = createSelector(
  selectDashboardFavoriteProductsState,
  state => state.item
);

export const selectDashboardFavoriteProductsLoading = createSelector(
  selectDashboardFavoriteProductsState,
  state => state.loading
);

export const selectDashboardFavoriteProductsLoaded = createSelector(
  selectDashboardFavoriteProductsState,
  state => state.loaded
);

export const selectFavoriteCount = createSelector(
  selectDashboardState,
  state => state.favoriteProductsCount
);

export const selectFavoriteIds = createSelector(
  selectDashboardState,
  state => state.favoriteProductsIds
);