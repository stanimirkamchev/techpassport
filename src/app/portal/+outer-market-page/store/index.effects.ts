import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {switchMap, map, catchError, withLatestFrom, tap, filter} from 'rxjs/operators';
import {of, forkJoin} from 'rxjs';
import {get} from 'lodash';

import * as fromOuterMarketActions from './index.actions';
import {ApiService} from '../../../common/services/api/api.service';
import {CsvExporterService} from '@services/csv-exporter/csv-exporter.service';
import {OuterMarketTableModel} from '../outerMarket.models';
import {CSVToArray} from '../helper/csvFormatter'

@Injectable()
export class OuterMarketEffects {

  loadDataTable$ = createEffect(() => this.actions$
    .pipe(ofType(fromOuterMarketActions.loadDataTable))
    .pipe(switchMap(() => this.apiService.getOuterMarketData()
      .pipe(map(data => fromOuterMarketActions.loadDataTableSuccess({data})))
      .pipe(catchError(error => of(fromOuterMarketActions.loadDataTableError({error}))))
    )));

  loadSearchesPreview$ = createEffect(() => this.actions$
    .pipe(ofType(fromOuterMarketActions.loadSearchesPreview))
    .pipe(switchMap(() => this.apiService.getOuterMarketSearchesPreview()
      .pipe(map(preview => fromOuterMarketActions.loadSearchesPreviewSuccess({preview})))
      .pipe(catchError(error => of(fromOuterMarketActions.loadSearchesPreviewError({error}))))
    )));

  constructor(
    private actions$: Actions,
    private csvExporter: CsvExporterService,
    private apiService: ApiService) {}
}
