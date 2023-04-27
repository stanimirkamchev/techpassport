import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, filter, tap, take } from 'rxjs/operators';
import { of } from 'rxjs';

import { CsvExporterService } from '@services/csv-exporter/csv-exporter.service';
import { ApiService } from '@services/api/api.service';
import * as fromSuperuser from './superuser.actions';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '@services/snackbar/snackbar.service';
import { UserEditModalComponent } from '../../+admin-page/+superuser-page/user-edit-modal/user-edit-modal.component';
import { UserDTO, UserRole, AccessLog, AccessManagement } from './superuser.model';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';

@Injectable()
export class SuperuserEffects {

  loadAccessManagement$ = createEffect(() => this.actions$
    .pipe(ofType(fromSuperuser.loadAccessManagement))
    .pipe(switchMap(() => this.apiService.adminGetAccessManagement().pipe(take(1))
      .pipe(map(accessManagement => fromSuperuser.loadAccessManagementSuccess({ accessManagement })))
      .pipe(catchError(error => of(fromSuperuser.loadAccessManagementError({ error }))))
    )));

  downloadAccessManagement$ = createEffect(() => this.actions$
    .pipe(ofType(fromSuperuser.downloadAccessManagement))
    .pipe(tap(({ accessManagement }) =>

    {
      const sanitize = (desc: string) => {
        if (desc) {
          desc = desc.replace(/,/g, '\,');
          desc = desc.replace(/"/g, '""');
        } else {
          desc = '';
        }
        return desc;
      };

      return this.csvExporter.export<AccessManagement>(accessManagement, [
        ['Name', (a: AccessManagement) => `"${sanitize(a.displayName)}"`],
        ['Email', (a: AccessManagement) => a.email],
        ['Phone', (a: AccessManagement) => a.phone],
        ['Role', (a: AccessManagement) => a.role],
        ['Created At', (a: AccessManagement) => a.createdAt + ''],
        ['Access Duration', (a: AccessManagement) => a.accessDuration + ''],
        ['Last Accessed', (a: AccessManagement) => a.lastAccessed + ''],
        ['Connections in Progress', (a: AccessManagement) => a.connectionsInProgress + ''],
        ['Connections Completed', (a: AccessManagement) => a.connectionsCompleted + ''],
        ['Type', (a: AccessManagement) => a.type],
        ['Company', (a: AccessManagement) => `"${sanitize(a.company)}"`],
        ['Company Country', (a: AccessManagement) => a.companyCountry],
        ['Status', (a: AccessManagement) => a.status],
      ], 'TechPassport Access Management export');
     }
    )),
    { dispatch: false });

  loadErrorHandling$ = createEffect(() => this.actions$
    .pipe(ofType(fromSuperuser.loadErrorHandling))
    .pipe(switchMap(() => this.apiService.adminGetErrorHandling().pipe(take(1))
      .pipe(map(errorHandling => fromSuperuser.loadErrorHandlingSuccess({ errorHandling })))
      .pipe(catchError(error => of(fromSuperuser.loadErrorHandlingError({ error }))))
    )));

  loadAccessLog$ = createEffect(() => this.actions$
    .pipe(ofType(fromSuperuser.loadAccessLog))
    .pipe(switchMap(() => this.apiService.adminGetAccessLog().pipe(take(1))
      .pipe(map(accessLog => fromSuperuser.loadAccessLogSuccess({ accessLog })))
      .pipe(catchError(error => of(fromSuperuser.loadAccessLogError({ error }))))
    )));

  downloadAccessLog$ = createEffect(() => this.actions$
    .pipe(ofType(fromSuperuser.downloadAccessLog))
    .pipe(tap(({ accessLog }) =>
    {

      const sanitize = (desc: string) => {
        if (desc) {
          desc = desc.replace(/,/g, '\,');
          desc = desc.replace(/"/g, '""');
        } else {
          desc = '';
        }
        return desc;
      };
      return this.csvExporter.export<AccessLog>(accessLog, [
        ['User Name', (a: AccessLog) => a.user && a.user.displayName && a.user.displayName.length > 0 ? `"${sanitize(a.user.displayName)}"` : 'n/a'],
        ['Company', (a: AccessLog) => a.user && a.user.company && a.user.company.length > 0 ? `"${sanitize(a.user.company)}"` :  'n/a'],
        ['Type', (a: AccessLog) => a.user.entityType],
        ['User Status', (a: AccessLog) => a.user.status],
        ['Referer IP', (a: AccessLog) => a.clientIP],
        ['Access Date', (a: AccessLog) => a.accessDate + ''],
        ['Access Duration', (a: AccessLog) => a.accessDuration + ''],
        ['Session Status', (a: AccessLog) => a.status]
      ], 'TechPassport Access Log export');
    })),
    { dispatch: false });

  createUser$ = createEffect(() => this.actions$
    .pipe(ofType(fromSuperuser.createUser))
    .pipe(switchMap(() => this.dialog.open(UserEditModalComponent).afterClosed()))
    .pipe(filter(user => !!user))
    .pipe(switchMap((userDTO: UserDTO) => this.apiService.adminCreateUser(userDTO).pipe(take(1))
      .pipe(tap(_ => this.snackbar.flash('User has been created')))
      .pipe(switchMap(user => [
        fromSuperuser.createUserSuccess({ user }),
        fromSuperuser.loadAccessManagement()
      ]))
      .pipe(catchError(error => (this.snackbar.flash(`Error creating User - ${error.error?.message}`), of(fromSuperuser.createUserError({ error })))))
    )));

  lockUser$ = createEffect(() => this.actions$
    .pipe(ofType(fromSuperuser.lockUser))
    .pipe(map(({ id: resolve, displayName, email }) => ({ subtitle: `Are you sure you want to lock ${displayName} - ${email} ?`, resolve })))
    .pipe(switchMap(data => this.dialog.open(ConfirmationModalComponent, { data }).afterClosed()))
    .pipe(filter(id => !!id))
    .pipe(switchMap((id: string) => this.apiService.adminLockUser(id)
      .pipe(tap(_ => this.snackbar.flash('User has been locked')))
      .pipe(map(user => fromSuperuser.lockUserSuccess({ user })))
      .pipe(catchError(error => (this.snackbar.flash(`Error locking User - ${error.error?.message}`), of(fromSuperuser.lockUserError({ error })))))
    )));

  unlockUser$ = createEffect(() => this.actions$
    .pipe(ofType(fromSuperuser.unlockUser))
    .pipe(map(({ id: resolve, displayName, email }) => ({ subtitle: `Are you sure you want to unlock ${displayName} - ${email} ?`, resolve })))
    .pipe(switchMap(data => this.dialog.open(ConfirmationModalComponent, { data }).afterClosed()))
    .pipe(filter(id => !!id))
    .pipe(switchMap((id: string) => this.apiService.adminUnlockUser(id)
      .pipe(tap(_ => this.snackbar.flash('User has been unlocked')))
      .pipe(map(user => fromSuperuser.unlockUserSuccess({ user })))
      .pipe(catchError(error => (this.snackbar.flash(`Error unlocking User - ${error.error?.message}`), of(fromSuperuser.unlockUserError({ error })))))
    )));

  deleteUser$ = createEffect(() => this.actions$
    .pipe(ofType(fromSuperuser.deleteUser))
    .pipe(map(({ id: resolve, displayName, email }) => ({ subtitle: `Are you sure you want to delete ${displayName} - ${email} ?`, resolve })))
    .pipe(switchMap(data => this.dialog.open(ConfirmationModalComponent, { data }).afterClosed()))
    .pipe(filter(id => !!id))
    .pipe(switchMap((id: string) => this.apiService.adminDeleteUser(id)
      .pipe(tap(_ => this.snackbar.flash('User has been deleted')))
      .pipe(map(_ => fromSuperuser.deleteUserSuccess({ id })))
      .pipe(catchError(error => (this.snackbar.flash(`Error deleting User - ${error.error?.message}`), of(fromSuperuser.deleteUserError({ error })))))
    )));

  destroySession$ = createEffect(() => this.actions$
    .pipe(ofType(fromSuperuser.destroySession))
    .pipe(map(({ id: resolve, isSamlAuthenticated, displayName, ip }) => (
      { subtitle: `Are you sure you want to destroy ${displayName} - ${ip} Session?`, resolve, isSamlAuthenticated })))
    .pipe(switchMap(data => {
        return this.dialog.open(ConfirmationModalComponent, { data }).afterClosed();
    }))
    .pipe(filter(id => !!id))
    .pipe(switchMap((id: string) => this.apiService.adminDestroyUserSession(id)
      .pipe(tap(_ => this.snackbar.flash('Session has been destroyed')))
      .pipe(map(_ => fromSuperuser.destroySessionSuccess({ id })))
      .pipe(catchError(error => (this.snackbar.flash(`Error deleting Session - ${error.error?.message}`), of(fromSuperuser.destroySessionError({ error })))))
    )));

  constructor(
    private actions$: Actions,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
    private csvExporter: CsvExporterService,
    private apiService: ApiService) { }
}
