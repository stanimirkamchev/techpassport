import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import * as fromDashboard from './store';
import { DashboardEffects } from './store/dashboard.effects';
import { SharedModule } from '@shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';

const effects = [
  DashboardEffects
];

import { DashboardPageComponent } from './+dashboard-page/dashboard-page.component';
import { DashboardKpisComponent } from './+dashboard-page/dashboard-kpis/dashboard-kpis.component';
import { DashboardAlertsComponent } from './+dashboard-page/dashboard-alerts/dashboard-alerts.component';
import { DashboardProjectsComponent } from './+dashboard-page/dashboard-projects/dashboard-projects.component';
import { DashboardResourcesComponent } from './+dashboard-page/dashboard-resources/dashboard-resources.component';
import { DashboardTrendsComponent } from './+dashboard-page/dashboard-trends/dashboard-trends.component';
import { AlertBoxComponent } from './alert-box/alert-box.component';
import { ProjectsTableComponent } from './+dashboard-page/dashboard-projects/projects-table/projects-table.component';

const components = [
  DashboardPageComponent,
  DashboardKpisComponent,
  DashboardAlertsComponent,
  DashboardProjectsComponent,
  DashboardResourcesComponent,
  DashboardTrendsComponent,
  AlertBoxComponent,
  ProjectsTableComponent,
  DashboardSuppliersComponent,
  DashboardWatchlistDetailComponent
];


import { PreviewModalMarketComponent } from './preview-modal-market/preview-modal-market.component';
import { PreviewModalSearchesComponent } from './preview-modal-searches/preview-modal-searches.component';
import { PreviewModalTechnologyComponent } from './preview-modal-technology/preview-modal-technology.component';
import { PreviewModalTrendsComponent } from './preview-modal-trends/preview-modal-trends.component';
import { PreviewModalAlertComponent } from './preview-modal-alert/preview-modal-alert.component';
import { DashboardSummaryComponent } from './+dashboard-page/dashboard-summary/dashboard-summary.component';
import { DashboardSuppliersComponent } from './+dashboard-page/dashboard-suppliers/dashboard-suppliers.component';
import { DashboardWatchlistComponent } from './+dashboard-page/dashboard-watchlist/dashboard-watchlist.component';
import { DashboardProjectsBuyerComponent } from './+dashboard-page/dashboard-projects-buyer/dashboard-projects-buyer.component';
import { ProjectsTableBuyerComponent } from './+dashboard-page/dashboard-projects-buyer/projects-table-buyer/projects-table-buyer.component';
import { DashboardAlertsBuyerComponent } from './+dashboard-page/dashboard-alerts-buyer/dashboard-alerts-buyer.component';
import { DashboardWatchlistDetailComponent } from './+dashboard-page/dashboard-watchlist-detail/dashboard-watchlist-detail.component';
import { InviteSuppliersModule } from '../invite-suppliers-module/invite-suppliers.module';

const modals = [
  PreviewModalMarketComponent,
  PreviewModalSearchesComponent,
  PreviewModalTechnologyComponent,
  PreviewModalTrendsComponent,
  PreviewModalAlertComponent
];

@NgModule({
  imports: [
    SharedModule,
    InviteSuppliersModule,
    DashboardRoutingModule,
    StoreModule.forFeature(fromDashboard.dashboardFeatureKey, fromDashboard.REDUCERS_TOKEN, { metaReducers: fromDashboard.metaReducers }),
    EffectsModule.forFeature(effects)
  ],
  providers: [fromDashboard.reducerProvider],
  declarations: [
    ...components,
    ...modals,
    DashboardSummaryComponent,
    DashboardSuppliersComponent,
    DashboardWatchlistComponent,
    DashboardProjectsBuyerComponent,
    ProjectsTableBuyerComponent,
    DashboardAlertsBuyerComponent,
  ],
  entryComponents: [
    ...modals
  ],
  exports: [
    ...components,
    ...modals
  ]
})
export class DashboardModule { }
