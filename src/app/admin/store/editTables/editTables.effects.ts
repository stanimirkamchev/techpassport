import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as editTables from './editTables.actions';
import { ApiService } from '@services/api/api.service';

@Injectable()
export class EditTablesEffects {

  loadTableTags$ = createEffect(() => this.actions$
    .pipe(ofType(editTables.loadTableTags))
    .pipe(switchMap((table) => this.apiService.adminGetTable(table.table)
      .pipe(map(table => editTables.loadTableTagsSuccess({ table: table })))
      .pipe(catchError(error => of(editTables.loadTableError({ error }))))
    )));

  loadTableFrameworks$ = createEffect(() => this.actions$
    .pipe(ofType(editTables.loadTableFrameworks))
    .pipe(switchMap((table) => this.apiService.adminGetTable(table.table)
    .pipe(map((table) => editTables.loadTableFrameworkSuccess({ table: table })))
      .pipe(catchError(error => of(editTables.loadTableError({ error }))))
    )));

  loadTableSolutions$ = createEffect(() => this.actions$
    .pipe(ofType(editTables.loadTableSolutions))
    .pipe(switchMap((table) => this.apiService.adminGetTable(table.table)
    .pipe(map((table) => editTables.loadTableSolutionSuccess({ table: table })))
      .pipe(catchError(error => of(editTables.loadTableError({ error }))))
    )));

  loadTableTaxonomies$ = createEffect(() => this.actions$
    .pipe(ofType(editTables.loadTableTaxonomies))
    .pipe(switchMap((table) => this.apiService.adminGetTable(table.table)
    .pipe(map((table) => editTables.loadTableTaxonomySuccess({ table: table })))
      .pipe(catchError(error => of(editTables.loadTableError({ error }))))
    )));

  // editTable$ = createEffect(() => this.actions$
  //   .pipe(ofType(editTables.editTable))
  //   .pipe(switchMap(({ table, entity }) => this.apiService.adminUpdateTable( table, entity )
  //     .pipe(map(table => editTables.loadTableSuccess({ table })))
  //     .pipe(catchError(error => of(editTables.loadTableError({ error }))))
  //   )));


  constructor(
    private actions$: Actions,
    private apiService: ApiService) {}
}
