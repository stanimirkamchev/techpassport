import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Sort } from '@angular/material/sort';
import { tap, filter, take, switchMap } from 'rxjs/operators';

import { State } from '../../store';
// tslint:disable
import { AccessManagement, ErrorHandling, AccessLog, AccessManagementFilters, ErrorHandlingFilters, AccessLogFilters } from '../../store/superuser/superuser.model';
import { loadAccessManagement, loadErrorHandling, loadAccessLog, downloadAccessLog, sortAccessManagement, filterAccessManagement, sortErrorHandling, filterErrorHandling, sortAccessLog, filterAccessLog, createUser, unlockUser, lockUser, deleteUser, destroySession, downloadAccessManagement, downloadErrorHandling } from '../../store/superuser/superuser.actions';
import { selectAccessManagementList, selectAccessManagementLoading, selectErrorHandlingList, selectErrorHandlingLoading, selectAccessLogList, selectAccessLogLoading, selectAccessManagementLoaded, selectErrorHandlingLoaded, selectAccessLogLoaded, selectAccessManagementCached, selectErrorHandlingCached, selectAccessLogCached, selectAccessManagementFilters, selectAccessLogFilters, selectErrorHandlingFilters } from '../../store/superuser/superuser.selector';
import { startBuyerOnboarding } from 'src/app/onboarding/store/buyer/buyer.actions';
import { ApiService } from '@services/api/api.service';
// tslint:enable

@Component({
  templateUrl: './superuser-page.component.html',
  styleUrls: ['./superuser-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuperuserPageComponent implements OnInit {

  accessManagement$: Observable<AccessManagement[]>;
  accessManagementFilters$: Observable<AccessManagementFilters>;
  accessManagementCached$: Observable<AccessManagement[]>;
  accessManagementLoading$: Observable<boolean>;

  errorHandling$: Observable<ErrorHandling[]>;
  errorHandlingFilters$: Observable<ErrorHandlingFilters>;
  errorHandlingCached$: Observable<ErrorHandling[]>;
  errorHandlingLoading$: Observable<boolean>;

  accessLog$: Observable<AccessLog[]>;
  accessLogFilters$: Observable<AccessLogFilters>;
  accessLogCached$: Observable<AccessLog[]>;
  accessLogLoading$: Observable<boolean>;

  constructor(
    private store: Store<State>,
    public apiService: ApiService) { }

  ngOnInit() {
    this.accessManagementFilters$ = this.store.select(selectAccessManagementFilters);
    this.accessManagementCached$ = this.store.select(selectAccessManagementCached);
    this.accessManagementLoading$ = this.store.select(selectAccessManagementLoading);
    this.accessManagement$ = this.store.select(selectAccessManagementLoaded)
      .pipe(tap(loaded => !loaded && this.store.dispatch(loadAccessManagement())))
      .pipe(filter(loaded => !!loaded), take(1))
      .pipe(switchMap(_ => this.store.select(selectAccessManagementList)));

    this.errorHandlingFilters$ = this.store.select(selectErrorHandlingFilters);
    this.errorHandlingCached$ = this.store.select(selectErrorHandlingCached);
    this.errorHandlingLoading$ = this.store.select(selectErrorHandlingLoading);
    this.errorHandling$ = this.store.select(selectErrorHandlingLoaded)
      .pipe(tap(loaded => !loaded && this.store.dispatch(loadErrorHandling())))
      .pipe(filter(loaded => !!loaded), take(1))
      .pipe(switchMap(_ => this.store.select(selectErrorHandlingList)));

    this.accessLogFilters$ = this.store.select(selectAccessLogFilters);
    this.accessLogCached$ = this.store.select(selectAccessLogCached);
    this.accessLogLoading$ = this.store.select(selectAccessLogLoading);
    this.accessLog$ = this.store.select(selectAccessLogLoaded)
      .pipe(tap(loaded => !loaded && this.store.dispatch(loadAccessLog())))
      .pipe(filter(loaded => !!loaded), take(1))
      .pipe(switchMap(_ => this.store.select(selectAccessLogList)));
  }

  refreshAccessLog() {
    this.store.dispatch(loadAccessLog());
  }

  downloadAccessLog(accessLog: AccessLog[]) {
    this.store.dispatch(downloadAccessLog({ accessLog }));
  }

  sortAccessManagement(sort: Sort) {
    this.store.dispatch(sortAccessManagement({ sort }));
  }

  filterAccessManagement(filters: AccessManagementFilters) {
    this.store.dispatch(filterAccessManagement({ filters }));
  }

  downloadAccessManagement(accessManagement: AccessManagement[]) {
    this.store.dispatch(downloadAccessManagement({ accessManagement }));
  }

  refreshAccessManagement() {
    this.store.dispatch(loadAccessManagement());
  }

  sortErrorHandling(sort: Sort) {
    this.store.dispatch(sortErrorHandling({ sort }));
  }

  filterErrorHandling(filters: ErrorHandlingFilters) {
    this.store.dispatch(filterErrorHandling({ filters }));
  }

  downloadErrorHandling(errorHandling: ErrorHandling[]) {
    this.store.dispatch(downloadErrorHandling({ errorHandling }));
  }

  refreshErrorHandling() {
    this.store.dispatch(loadErrorHandling());
  }

  sortAccessLog(sort: Sort) {
    this.store.dispatch(sortAccessLog({ sort }));
  }

  filterAccessLog(filters: AccessLogFilters) {
    this.store.dispatch(filterAccessLog({ filters }));
  }

  createUser() {
    this.store.dispatch(createUser());
  }

  unlockUser({ user }: AccessLog) {
    this.store.dispatch(unlockUser({ id: user._id, displayName: user.displayName, email: user.email  }));
  }

  lockUser({ user }: AccessLog) {
    this.store.dispatch(lockUser({ id: user._id, displayName: user.displayName, email: user.email  }));
  }

  deleteUser({ user }: AccessLog) {
    this.store.dispatch(deleteUser({ id: user._id, displayName: user.displayName, email: user.email }));
  }

  destroySession(session: AccessLog) {
    this.store.dispatch(destroySession({ id: session._id, isSamlAuthenticated: session.isSamlAuthenticated, displayName: session.user.displayName, ip: session.clientIP }));
  }

  newBuyerOnboarding() {
    this.store.dispatch(startBuyerOnboarding({}));
  }
}
