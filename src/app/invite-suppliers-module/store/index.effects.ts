import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import * as fromInviteSuppliersActions from './index.actions';
import { ApiService } from '../../common/services/api/api.service';

@Injectable()
export class InviteSuppliersEffects {

  loadDataTable$ = createEffect(() => this.actions$
    .pipe(ofType(fromInviteSuppliersActions.loadDataTable))
    .pipe(switchMap(() => this.apiService.getInviteSuppliersData()
      .pipe(map(data => fromInviteSuppliersActions.loadDataTableSuccess({ data })))
      .pipe(catchError(error => of(fromInviteSuppliersActions.loadDataTableError({ error }))))
    )));

  setStatus$ = createEffect(() => this.actions$
    .pipe(ofType(fromInviteSuppliersActions.setStatus))
    .pipe(switchMap((data) => this.apiService.invitationChangeStatus(data.element._id, data.status)
    )), { dispatch: false });

  constructor(
    private actions$: Actions,
    private apiService: ApiService) { }
}
