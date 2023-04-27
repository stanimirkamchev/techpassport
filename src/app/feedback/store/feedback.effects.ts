import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, filter, catchError, tap } from 'rxjs/operators';

import * as fromFeedback from './feedback.actions';
import { ApiService } from '@services/api/api.service';
import { CsvExporterService } from '@services/csv-exporter/csv-exporter.service';
import { SnackbarService } from '@services/snackbar/snackbar.service';
import { State } from './feedback.reducer';
import { FeedbackLoopModalComponent } from '../feedback-loop-modal/feedback-loop-modal.component';
import { throwError } from 'rxjs';

const feedbackModalOptions = {
  width: '51vw',
  height: '86vh',
  disableClose: true
};

@Injectable()
export class FeedbackEffects {

  createFeedbackLoop$ = createEffect(() => this.actions$
    .pipe(ofType(fromFeedback.createFeedbackLoop))
    .pipe(switchMap(({ projectId }) => this.apiService.feedbackGetSchema(projectId)
      .pipe(map((schema) => ({ ...feedbackModalOptions, data: { schema } } as MatDialogConfig)))
      .pipe(tap(console.log))
      .pipe(switchMap(config => this.dialog.open(FeedbackLoopModalComponent, config).afterClosed()))
      .pipe(filter(data => !!data))
      .pipe(switchMap(({ feedbackLoop, draft }) => this.apiService.feedbackUpdateFeedbackLoop(projectId, feedbackLoop, draft)
        .pipe(map(response => fromFeedback.createFeedbackLoopSuccess({ feedbackLoop: response })))
        .pipe(catchError(error => (
          this.store$.dispatch(fromFeedback.createFeedbackLoopError({ error })),
          this.snackbar.flash(`Error - ${error.error?.message}`),
          throwError(error)
        ))))))
    ));

  updateFeedbackLoop$ = createEffect(() => this.actions$
    .pipe(ofType(fromFeedback.updateFeedbackLoop))
    .pipe(map(({ feedbackLoop }) => ({ data: { feedbackLoop }, ...feedbackModalOptions } as MatDialogConfig)))
    .pipe(switchMap(config => this.dialog.open(FeedbackLoopModalComponent, config).afterClosed())), { dispatch: false });

  constructor(
    private actions$: Actions,
    private store$: Store<State>,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
    private csvExporter: CsvExporterService,
    private apiService: ApiService) { }
}
