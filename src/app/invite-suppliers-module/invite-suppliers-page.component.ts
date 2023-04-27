import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { InvitationStatus, InvitationType, InvitationUserType, InviteSuppliersTableModel } from './invite-suppliers.model';
import * as inviteSuppliersSelectors from './store/index.selector';
import { selectDataLoading } from './store/index.selector';
import { Store } from '@ngrx/store';
import { filter, take, tap } from 'rxjs/operators';
import * as inviteSuppliersActions from './store/index.actions';
import { setFilter } from './store/index.actions';
import { PaginatorService } from './services/paginator.service';

@Component({
  selector: 'invite-suppliers-page',
  templateUrl: './invite-suppliers-page.component.html',
  styleUrls: ['./invite-suppliers-page.component.scss']
})
export class InviteSuppliersPageComponent implements OnInit, OnDestroy {

  pageIndex = 1;
  pageSize = 10;
  total = 0;

  loading$: Observable<boolean>;

  constructor(
    private store: Store,
    private paginatorService: PaginatorService,
  ) { }

  ngOnDestroy(): void {
    this.store.dispatch(setFilter({
      filter: {
        status: InvitationStatus.ALL,
        type: InvitationType.ALL,
        userType: InvitationUserType.ALL,
        company: 'all',
        emailAddress: 'all',
        dateFrom: '',
        dateTo: '',
      }
    }));
  }

  ngOnInit(): void {
    this.loading$ = this.store.select(selectDataLoading);
    this.store.select(inviteSuppliersSelectors.selectDataLoaded)
      .pipe(tap(loaded => !loaded && this.store.dispatch(inviteSuppliersActions.loadDataTable())))
      .pipe(filter(loaded => !!loaded), take(1))
      .subscribe();

    this.paginatorService.paginationOverview.subscribe(paginator => {
      this.total = paginator.total;
    });
  }

  onPageSizeChange(event: number) {
    this.pageSize = event;
    this.pageIndex = 1;
    this.paginatorService.setPagination({
      pageSize: this.pageSize,
      pageIndex: this.pageIndex
    });
  }

  onPageIndexChange() {
    this.paginatorService.setPagination({
      pageIndex: this.pageIndex
    });
  }

  onfilterChange() {
    this.pageIndex = 1;
    this.paginatorService.setPagination({
      pageIndex: this.pageIndex
    });
  }
}
