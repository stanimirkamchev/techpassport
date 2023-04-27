
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, filter } from 'rxjs/operators';
import { of } from 'rxjs';

import * as fromMarketplaceActions from './index.actions';
import { ApiService } from '../../common/services/api/api.service';
import { Injectable } from '@angular/core';

@Injectable()
export class MarketplaceEffects {

  loadDataTable$ = createEffect(() => this.actions$
    .pipe(ofType(fromMarketplaceActions.loadDataTable))
    .pipe(switchMap(() => this.apiService.getMarketplaceProducts()
      .pipe(map((data: any) => fromMarketplaceActions.loadDataTableSuccess({ data: data.body.items })))
      .pipe(catchError(error => of(fromMarketplaceActions.loadDataTableError({ error }))))
    )));

  updateBuyerCompanyInvoices$ = createEffect(() => this.actions$
    .pipe(ofType(fromMarketplaceActions.addWatchlistCount))
    .pipe(filter(({ data }) => data.length > 0))
    .pipe(switchMap(({ data }) => of(data)
      .pipe(map(_ => fromMarketplaceActions.addWatchlistCountSuccess()))
    )));

  constructor(
    private actions$: Actions,
    private apiService: ApiService) { }
}
