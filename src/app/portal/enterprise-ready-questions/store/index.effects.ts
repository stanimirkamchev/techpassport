import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as fromERQActions from './index.actions';
import { ApiService } from '../../../common/services/api/api.service';

@Injectable()
export class ERQEffects {

  loadDataTable$ = createEffect(() => this.actions$
    .pipe(ofType(fromERQActions.loadDataTable))
    .pipe(switchMap(() => this.apiService.getERQ()
      .pipe(map(data => fromERQActions.loadDataTableSuccess({ data })))
      .pipe(catchError(error => of(fromERQActions.loadDataTableError({ error }))))
    )));

  constructor(
    private actions$: Actions,
    private apiService: ApiService) { }
}
