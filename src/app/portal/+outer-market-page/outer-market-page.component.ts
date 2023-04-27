import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { OuterMarketTableModel } from './outerMarket.models';
import { MatDialog } from '@angular/material/dialog';
import { InviteModalComponent } from '../invite-modal/invite-modal.component';
import { FilterModalComponent } from '../filter-modal/filter-modal.component';
import { Store } from '@ngrx/store';
import * as outerMarketSelectors from './store/index.selector';
import { selectDataLoading } from './store/index.selector';
import { filter, switchMap, take, tap } from 'rxjs/operators';
import * as outerMarketActions from './store/index.actions';
import { PopUpService } from '@shared/pop-up-service';
import { SnackbarService } from '@services/snackbar/snackbar.service';
import { FilterService } from '@shared/filter-service';
import { OnBoardModalComponent } from '../on-board-modal/on-board-modal.component';

@Component({
  selector: 'outer-market-page',
  templateUrl: './outer-market-page.component.html',
  styleUrls: ['./outer-market-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class OuterMarketPageComponent implements OnInit, OnDestroy {
  constructor(
    private addDialog: MatDialog,
    private store: Store,
    private popUpService: PopUpService,
    private snackbar: SnackbarService,
    private filterService: FilterService,
  ) {
    this.popUpService.popUpOverview.subscribe(data => {
      this.invitedSuppliers = data.items;
      if (data.success) {
        this.invitedSuppliers = [];
        this.store.dispatch(outerMarketActions.loadDataTable());
        this.snackbar.flash('The data updated successfully');
      } else if (data.success === false) {
        this.invitedSuppliers = [];
        this.store.dispatch(outerMarketActions.loadDataTable());
        this.snackbar.flash('The data failed to update');
      } else {
        // nothing
      }
    });

    this.filterService.filterCounterOverview.subscribe(data => {
      this.isFilterActive = data > 0;
    });
  }

  dataSource$: Observable<OuterMarketTableModel[]>;
  loading$: Observable<boolean>;
  loaded$: Observable<boolean>;
  selectedRows: any[];
  clearTable = false;
  filterValue: string;
  searchedColumn: string;
  invitedSuppliers: number[] | [];
  isFilterActive = false;
  records: OuterMarketTableModel[];

  ngOnInit(): void {
    this.loading$ = this.store.select(selectDataLoading);
    this.dataSource$ = this.store.select(outerMarketSelectors.selectDataLoaded)
      .pipe(tap(loaded => !loaded && this.store.dispatch(outerMarketActions.loadDataTable())))
      .pipe(filter(loaded => !!loaded), take(1))
      .pipe(switchMap(_ => this.store.select(outerMarketSelectors.selectData)));
    this.loaded$ = this.store.select(outerMarketSelectors.selectDataLoaded);
  }

  ngOnDestroy() {
    this.filterService.attachData({
      sent: true,
      outputFilteredData: {
        taxonomy: [],
        company: [],
        country: [],
        totalFunding: [],
        latestFundingRound: [],
        latestFundingDate: [],
        investors: [],
        latestValuation: [],
        acquirers: []
      },
      resultFilteredData: {}
    });
  }

  selectedRowItems(ev: any): void {
    this.selectedRows = ev;
  }

  setAllRecords(records: OuterMarketTableModel[]) {
    this.records = records;
  }

  onClickInviteSelected(): number[] {
    const ref = this.addDialog.open(InviteModalComponent, {
      width: '655px',
      height: 'auto',
      maxWidth: undefined,
      panelClass: 'invite-modal',
      disableClose: false,
      data: { items: this.selectedRows }
    });
    ref.afterClosed().subscribe(_ => {
      this.clearTable = true;
    });

    this.clearTable = false;

    if (this.selectedRows.length > 0) {
      return this.selectedRows.map((item: any) => item.orgId);
    }
  }

  onClickCancelInvited(): number[] {
    const ref = this.addDialog.open(InviteModalComponent, {
      width: '655px',
      height: 'auto',
      maxWidth: undefined,
      panelClass: 'invite-modal',
      disableClose: false,
      data: { items: this.selectedRows, isCancelInvited: true }
    });
    ref.afterClosed().subscribe(_ => {
      this.clearTable = true;
    });

    this.clearTable = false;

    if (this.selectedRows.length > 0) {
      return this.selectedRows.map((item: any) => item.orgId);
    }
  }

  onClickOnBoardSelectedItem(selectedItem: OuterMarketTableModel): void {
    const ref = this.addDialog.open(OnBoardModalComponent, {
      width: '655px',
      height: 'auto',
      maxWidth: undefined,
      panelClass: 'on-board-modal',
      disableClose: false,
      data: { item: selectedItem }
    });
    ref.afterClosed().subscribe(_ => {
      this.clearTable = true;
    });

    this.clearTable = false;
  }

  onClickOpenFilterModal(): void {
    const ref = this.addDialog.open(FilterModalComponent, {
      width: '360px',
      height: '100%',
      maxWidth: undefined,
      panelClass: 'portal-filter-modal',
      disableClose: false
    });
    ref.afterClosed().subscribe(_ => {
      this.clearTable = true;
    });

    this.clearTable = false;
  }

  onSubmitFilterValue(val: string): void {
    this.filterValue = val;
  }

  searchByFilterColumn(val: string): void {
    if (val.length === 0) {
      this.searchedColumn = 'all';
    }
    this.searchedColumn = val;
  }

}
