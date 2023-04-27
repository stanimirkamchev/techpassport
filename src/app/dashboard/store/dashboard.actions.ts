import { createAction, props } from '@ngrx/store';
import { Dashboard, DashboardFilters, DashboardKPIs, DashboardAlerts, DashboardResources,
          DashboardSecurityTrends, DashboardProject, DashboardProjectFilters, MarketPreview,
          SearchesPreview, TechnologyPreview, TrendsPreview, BankShortlistItem, Suppliers } from './dashboard.model';
import { Sort } from '@angular/material/sort';

// loadDashboard
export const loadDashboard = createAction(
  '[Dashboard/API] Load Dashboard',
  props<{ filters: DashboardFilters }>()
);

export const loadDashboardSuccess = createAction(
  '[Dashboard/API] Load Dashboard Success',
  props<{ dashboard: Dashboard }>()
);

export const loadDashboardError = createAction(
  '[Dashboard/API] Load Dashboard Error',
  props<{ error: any }>()
);

// filterDashboard
export const filterDashboard = createAction(
  '[Dashboard/API] Filter Dashboard',
  props<{ filters: DashboardFilters }>()
);


// loadKPIs
export const loadKPIs = createAction(
  '[Dashboard/API] Load KPIs',
  props<{ filters: DashboardFilters }>()
);

export const loadKPIsSuccess = createAction(
  '[Dashboard/API] Load KPIs Success',
  props<{ kpis: DashboardKPIs }>()
);

export const loadKPIsError = createAction(
  '[Dashboard/API] Load KPIs Error',
  props<{ error: any }>()
);


// loadAlerts
export const loadAlerts = createAction(
  '[Dashboard/API] Load Alerts',
  props<{ filters: DashboardFilters }>()
);

export const loadAlertsSuccess = createAction(
  '[Dashboard/API] Load Alerts Success',
  props<{ alerts: DashboardAlerts }>()
);

export const loadAlertsError = createAction(
  '[Dashboard/API] Load Alerts Error',
  props<{ error: any }>()
);

// openAlertsConnections
export const openAlertsConnections = createAction(
  '[Dashboard/API] Open Alerts Connections',
  props<{ alerts: DashboardAlerts, box: string, allBusinessGroups: boolean }>()
);


// loadTrends
export const loadTrends = createAction(
  '[Dashboard/API] Load Trends',
  props<{ filters: DashboardFilters }>()
);

export const loadTrendsSuccess = createAction(
  '[Dashboard/API] Load Trends Success',
  props<{ trends: DashboardSecurityTrends }>()
);

export const loadTrendsError = createAction(
  '[Dashboard/API] Load Trends Error',
  props<{ error: any }>()
);


// loadProjects
export const loadProjects = createAction(
  '[Dashboard/API] Load Projects',
  props<{ filters: DashboardFilters }>()
);

export const loadProjectsSuccess = createAction(
  '[Dashboard/API] Load Projects Success',
  props<{ projects: DashboardProject[] }>()
);

export const loadProjectsError = createAction(
  '[Dashboard/API] Load Projects Error',
  props<{ error: any }>()
);

export const filterProjects = createAction(
  '[Dashboard/API] Filter Projects',
  props<{ filters: DashboardProjectFilters }>()
);

export const sortProjects = createAction(
  '[Dashboard/API] Sort Projects',
  props<{ sort: Sort }>()
);



// loadResources
export const loadResources = createAction(
  '[Dashboard/API] Load Resources',
  props<{ filters: DashboardFilters }>()
);

export const loadResourcesSuccess = createAction(
  '[Dashboard/API] Load Resources Success',
  props<{ resources: DashboardResources }>()
);

export const loadResourcesError = createAction(
  '[Dashboard/API] Load Resources Error',
  props<{ error: any }>()
);

// setResourcesUsers
export const setResourcesUsers = createAction(
  '[Dashboard/API] Select Resources Users',
  props<{ users: string[] }>()
);


// loadMarketPreview
export const loadMarketPreview = createAction(
  '[Dashboard/API] Load Market Preview',
  props<{ customerID?: string }>()
);

export const loadMarketPreviewSuccess = createAction(
  '[Dashboard/API] Load Market Preview Success',
  props<{ preview: MarketPreview[] }>()
);

export const loadMarketPreviewError = createAction(
  '[Dashboard/API] Load Market Preview Error',
  props<{ error: any }>()
);

export const filterMarketPreview = createAction(
  '[Dashboard/API] Filter MarketPreview',
  // props<{ filters: MarketPreviewFilters }>()
);

export const sortMarketPreview = createAction(
  '[Dashboard/API] Sort MarketPreview',
  props<{ sort: Sort }>()
);

export const exportMarketPreview = createAction(
  '[Dashboard/API] Export MarketPreview',
  props<{ preview: MarketPreview[] }>()
);


// loadSearchesPreview
export const loadSearchesPreview = createAction(
  '[Dashboard/API] Load Searches Preview',
  props<{ customerID?: string }>()
);

export const loadSearchesPreviewSuccess = createAction(
  '[Dashboard/API] Load Searches Preview Success',
  props<{ preview: SearchesPreview[] }>()
);

export const loadSearchesPreviewError = createAction(
  '[Dashboard/API] Load Searches Preview Error',
  props<{ error: any }>()
);

export const filterSearchesPreview = createAction(
  '[Dashboard/API] Filter SearchesPreview',
  // props<{ filters: SearchesPreviewFilters }>()
);

export const sortSearchesPreview = createAction(
  '[Dashboard/API] Sort SearchesPreview',
  props<{ sort: Sort }>()
);

export const exportSearchesPreview = createAction(
  '[Dashboard/API] Export SearchesPreview',
  props<{ preview: SearchesPreview[] }>()
);


// loadTechnologyPreview
export const loadTechnologyPreview = createAction(
  '[Dashboard/API] Load Technology Preview',
  props<{ customerID?: string }>()
);

export const loadTechnologyPreviewSuccess = createAction(
  '[Dashboard/API] Load Technology Preview Success',
  props<{ preview: TechnologyPreview[] }>()
);

export const loadTechnologyPreviewError = createAction(
  '[Dashboard/API] Load Technology Preview Error',
  props<{ error: any }>()
);

export const filterTechnologyPreview = createAction(
  '[Dashboard/API] Filter TechnologyPreview',
  // props<{ filters: TechnologyPreviewFilters }>()
);

export const sortTechnologyPreview = createAction(
  '[Dashboard/API] Sort TechnologyPreview',
  props<{ sort: Sort }>()
);

export const exportTechnologyPreview = createAction(
  '[Dashboard/API] Export TechnologyPreview',
  props<{ preview: TechnologyPreview[] }>()
);


// loadTrendsPreview
export const loadTrendsPreview = createAction(
  '[Dashboard/API] Load Trends Preview',
  props<{ customerID?: string }>()
);

export const loadTrendsPreviewSuccess = createAction(
  '[Dashboard/API] Load Trends Preview Success',
  props<{ preview: TrendsPreview[] }>()
);

export const loadTrendsPreviewError = createAction(
  '[Dashboard/API] Load Trends Preview Error',
  props<{ error: any }>()
);

export const filterTrendsPreview = createAction(
  '[Dashboard/API] Filter TrendsPreview',
  // props<{ filters: TrendsPreviewFilters }>()
);

export const sortTrendsPreview = createAction(
  '[Dashboard/API] Sort TrendsPreview',
  props<{ sort: Sort }>()
);

export const exportTrendsPreview = createAction(
  '[Dashboard/API] Export TrendsPreview',
  props<{ preview: TrendsPreview[] }>()
);

// loadBanksShortlist
export const loadBanksShortlist = createAction(
  '[Dashboard/API] Load Banks Shortlist'
);

export const loadBanksShortlistSuccess = createAction(
  '[Dashboard/API] Load Banks Shortlist Success',
  props<{ banksShortlist: BankShortlistItem[] }>()
);

export const loadBanksShortlistError = createAction(
  '[Dashboard/API] Load Banks Shortlist Error',
  props<{ error: any }>()
);


// load Products
export const loadProducts = createAction(
  '[Dashboard/API] Load Products',
  props<{ customerID?: string, chunk: string }>()
);

export const loadProductsSuccess = createAction(
  '[Dashboard/API] Load Products Success',
  props<{ products: any }>() // Products model
);

export const loadProductsError = createAction(
  '[Dashboard/API] Load Products Error',
  props<{ error: any }>()
);

// load Favorite Products
export const loadFavoriteProducts = createAction(
  '[Dashboard/API] Load Favorite Products',
  props<{ customerID?: string }>()
);

export const loadFavoriteProductsSuccess = createAction(
  '[Dashboard/API] Load Favorite Products Success',
  props<{ favoriteProducts: any }>() // Suppliers model
);

export const loadFavoriteProductsError = createAction(
  '[Dashboard/API] Load Favorite Products Error',
  props<{ error: any }>()
);