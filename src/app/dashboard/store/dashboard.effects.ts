import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MatDialog } from '@angular/material/dialog';
import { switchMap, take, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { SnackbarService } from '@services/snackbar/snackbar.service';
import { CsvExporterService } from '@services/csv-exporter/csv-exporter.service';
import { ApiService } from '@services/api/api.service';
import * as fromDashboard from './dashboard.actions';
import { PreviewModalMarketComponent } from '../preview-modal-market/preview-modal-market.component';
import { PreviewModalSearchesComponent } from '../preview-modal-searches/preview-modal-searches.component';
import { PreviewModalTechnologyComponent } from '../preview-modal-technology/preview-modal-technology.component';
import { PreviewModalTrendsComponent } from '../preview-modal-trends/preview-modal-trends.component';
import { PreviewModalAlertComponent } from '../preview-modal-alert/preview-modal-alert.component';

@Injectable()
export class DashboardEffects {

  loadDashboard$ = createEffect(() => this.actions$
    .pipe(ofType(fromDashboard.loadDashboard))
    .pipe(switchMap(({ filters }) => ([
      fromDashboard.loadKPIs({ filters }),
      fromDashboard.loadAlerts({ filters }),
      fromDashboard.loadTrends({ filters }),
      fromDashboard.loadProjects({ filters }),
      fromDashboard.loadResources({ filters }),
    ]))));

  filterDashboard$ = createEffect(() => this.actions$
    .pipe(ofType(fromDashboard.filterDashboard))
    .pipe(switchMap(({ filters }) => ([
      fromDashboard.loadKPIs({ filters }),
      fromDashboard.loadAlerts({ filters }),
      fromDashboard.loadTrends({ filters })
    ]))));

  loadKpis$ = createEffect(() => this.actions$
    .pipe(ofType(fromDashboard.loadKPIs))
    .pipe(switchMap(({ filters }) => this.apiService.dashboardGetKPIs(filters)
      .pipe(map(kpis => fromDashboard.loadKPIsSuccess({ kpis })))
      .pipe(catchError(error => of(fromDashboard.loadKPIsError({ error }))))
    )));

  loadAlerts$ = createEffect(() => this.actions$
    .pipe(ofType(fromDashboard.loadAlerts))
    .pipe(switchMap(({ filters }) => this.apiService.dashboardGetAlerts(filters)
      .pipe(map(alerts => fromDashboard.loadAlertsSuccess({ alerts })))
      .pipe(catchError(error => of(fromDashboard.loadAlertsError({ error }))))
    )));

  loadAlertsPreview$ = createEffect(() => this.actions$
    .pipe(ofType(fromDashboard.openAlertsConnections))
    .pipe(tap(({ alerts, box, allBusinessGroups }) => this.dialog.open(PreviewModalAlertComponent, { data: { alerts, box, allBusinessGroups }, width: '90vw', height: '86vh' }))), { dispatch: false });

  loadTrends$ = createEffect(() => this.actions$
    .pipe(ofType(fromDashboard.loadTrends))
    .pipe(switchMap(({ filters }) => this.apiService.dashboardGetTrends(filters)
      .pipe(map(trends => fromDashboard.loadTrendsSuccess({ trends })))
      .pipe(catchError(error => of(fromDashboard.loadTrendsError({ error }))))
    )));

  loadProjects$ = createEffect(() => this.actions$
    .pipe(ofType(fromDashboard.loadProjects))
    .pipe(switchMap(({ filters }) => this.apiService.dashboardGetProjects(filters)
      .pipe(map(projects => fromDashboard.loadProjectsSuccess({ projects })))
      .pipe(catchError(error => of(fromDashboard.loadProjectsError({ error }))))
    )));

  loadResources$ = createEffect(() => this.actions$
    .pipe(ofType(fromDashboard.loadResources))
    .pipe(switchMap(({ filters }) => this.apiService.dashboardGetResources(filters)
      .pipe(map(resources => fromDashboard.loadResourcesSuccess({ resources })))
      .pipe(catchError(error => of(fromDashboard.loadResourcesError({ error }))))
    )));

  loadMarketPreview$ = createEffect(() => this.actions$
    .pipe(ofType(fromDashboard.loadMarketPreview))
    .pipe(switchMap(({ customerID }) => this.apiService.dashboardGetMarketPreview(customerID)
      .pipe(map(preview => fromDashboard.loadMarketPreviewSuccess({ preview })))
      .pipe(catchError(error => of(fromDashboard.loadMarketPreviewError({ error }))))
    )));

  openMarketPreview$ = createEffect(() => this.actions$
    .pipe(ofType(fromDashboard.loadMarketPreviewSuccess))
    .pipe(tap(data => this.dialog.open(PreviewModalMarketComponent, { data, width: '90vw', height: '86vh' }))), { dispatch: false });

  exportMarketPreview$ = createEffect(() => this.actions$
    .pipe(ofType(fromDashboard.exportMarketPreview))
    .pipe(tap(({ preview }) => this.csvExporter.export(preview, [
      'region', 'businessUnit', 'originator', 'supplier', 'product',
      'projectName', 'projectId', 'hasPOC', 'hasCompliance', 'ndaDate', 'pocDate',
    ], 'TechPassport export'))), { dispatch: false }); // 'postPOC'

  loadSearchesPreview$ = createEffect(() => this.actions$
    .pipe(ofType(fromDashboard.loadSearchesPreview))
    .pipe(switchMap(({ customerID }) => this.apiService.dashboardGetSearchesPreview(customerID)
      .pipe(map(preview => fromDashboard.loadSearchesPreviewSuccess({ preview })))
      .pipe(catchError(error => of(fromDashboard.loadSearchesPreviewError({ error }))))
    )));

  openSearchesPreview$ = createEffect(() => this.actions$
    .pipe(ofType(fromDashboard.loadSearchesPreviewSuccess))
    .pipe(tap(data => this.dialog.open(PreviewModalSearchesComponent, { data, width: '90vw', height: '86vh' }))), { dispatch: false });

  exportSearchesPreview$ = createEffect(() => this.actions$
    .pipe(ofType(fromDashboard.exportSearchesPreview))
    .pipe(tap(({ preview }) => {
      const sanitize = (desc: string) => {
        if (desc) {
          desc = desc.replace(/,/g, '\,');
          desc = desc.replace(/"/g, '""');
        } else {
          desc = '';
        }
        return desc;
      };

      return this.csvExporter.export(preview, [
        'searchDate',
        'country',
        ['functionality', (s) => {
          const functionality = s.functionality && s.functionality.length > 0 ? s.functionality : null;
          return functionality && functionality.length > 0 ? `"${sanitize(functionality.join(', '))}"` : 'n/a';
        }],
        'haveNDA',
        'havePOC',
        'productsFound',
        'suppliersFound',
        'user'
      ], 'TechPassport export');
    })), { dispatch: false }); // 'haveConversation',//'technology',

  loadTechnologyPreview$ = createEffect(() => this.actions$
    .pipe(ofType(fromDashboard.loadTechnologyPreview))
    .pipe(switchMap(({ customerID }) => this.apiService.dashboardGetTechnologyPreview(customerID)
      .pipe(map(preview => fromDashboard.loadTechnologyPreviewSuccess({ preview })))
      .pipe(catchError(error => of(fromDashboard.loadTechnologyPreviewError({ error }))))
    )));

  openTechnologyPreview$ = createEffect(() => this.actions$
    .pipe(ofType(fromDashboard.loadTechnologyPreviewSuccess))
    .pipe(tap(data => this.dialog.open(PreviewModalTechnologyComponent, { data, width: '90vw', height: '86vh' }))), { dispatch: false });

  exportTechnologyPreview$ = createEffect(() => this.actions$
    .pipe(ofType(fromDashboard.exportTechnologyPreview))
    .pipe(tap(({ preview }) => {
      const sanitize = (desc: string) => {
        if (desc) {
          desc = desc.replace(/,/g, '\,');
          desc = desc.replace(/"/g, '""');
        } else {
          desc = '';
        }
        return desc;
      };

      return this.csvExporter.export(preview, [
        'functionality',
        'compliance',
        'POC',
        'originator',
        'projectName',
        'ndaDate',
        'pocDate'
      ], 'TechPassport export');
    })), { dispatch: false }); // 'region', 'businessUnit',

  loadTrendsPreview$ = createEffect(() => this.actions$
    .pipe(ofType(fromDashboard.loadTrendsPreview))
    .pipe(switchMap(({ customerID }) => this.apiService.dashboardGetTrendsPreview(customerID)
      .pipe(map(preview => fromDashboard.loadTrendsPreviewSuccess({ preview })))
      .pipe(catchError(error => of(fromDashboard.loadTrendsPreviewError({ error }))))
    )));

  openTrendsPreview$ = createEffect(() => this.actions$
    .pipe(ofType(fromDashboard.loadTrendsPreviewSuccess))
    .pipe(tap(data => this.dialog.open(PreviewModalTrendsComponent, { data, width: '90vw', height: '86vh' }))), { dispatch: false });

  exportTrendsPreview$ = createEffect(() => this.actions$
    .pipe(ofType(fromDashboard.exportTrendsPreview))
    .pipe(tap(({ preview }) => this.csvExporter.export(preview, [
      'businessUnit',
      'region',
      'projectName',
      'projectId',
      'haveNDA',
      'ndaDate',
      'havePOC',
      'hasSoc2',
      'hasISO27001',
      'hasCyberEssentials',
      'hasCyberEssentialsPlus',
      'allSecurityQuestions'
    ], 'TechPassport export'))), { dispatch: false });

  leadBanksShortlist$ = createEffect(() => this.actions$
    .pipe(ofType(fromDashboard.loadBanksShortlist))
    .pipe(switchMap(() => this.apiService.getBanksShortlist()
      .pipe(map(banksShortlist => fromDashboard.loadBanksShortlistSuccess({ banksShortlist })))
      .pipe(catchError(error => of(fromDashboard.loadBanksShortlistError({ error }))))
    )));

  loadProducts$ = createEffect(() => this.actions$
    .pipe(ofType(fromDashboard.loadProducts))
    .pipe(switchMap(({ customerID, chunk }) => this.apiService.dashboardGetProducts(customerID, chunk)
      .pipe(map(products => fromDashboard.loadProductsSuccess({ products })))
      .pipe(catchError(error => of(fromDashboard.loadProductsError({ error }))))
    )));

  loadFavoriteProducts$ = createEffect(() => this.actions$
    .pipe(ofType(fromDashboard.loadFavoriteProducts))
    .pipe(switchMap(({ customerID }) => this.apiService.dashboardGetFavoriteProducts(customerID)
      .pipe(map(favoriteProducts => fromDashboard.loadFavoriteProductsSuccess({ favoriteProducts })))
      .pipe(catchError(error => of(fromDashboard.loadFavoriteProductsError({ error }))))
    )));

  constructor(
    private actions$: Actions,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
    private csvExporter: CsvExporterService,
    private apiService: ApiService) { }
}


