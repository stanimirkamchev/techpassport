
import {
  Component, OnInit, OnChanges,
  ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef
} from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';
import { Sort, MatSort } from '@angular/material/sort';
import { OuterMarketTableModel, InvitationStatus } from '../outerMarket.models';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api/api.service';
import { SelectionModel } from '@angular/cdk/collections';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FilterService } from '@shared/filter-service';
import * as moment from 'moment';

@Component({
  selector: 'outer-market-table',
  templateUrl: './outer-market-table.component.html',
  styleUrls: ['./outer-market-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OuterMarketTableComponent implements OnInit, OnChanges {
  constructor(
    public apiService: ApiService,
    private _liveAnnouncer: LiveAnnouncer,
    private filterService: FilterService,
    private ref: ChangeDetectorRef
  ) { }

  @Input() loading: boolean;
  @Input() set outerMarket(outerMarket: OuterMarketTableModel[]) {
    if (outerMarket) {
      // this.allRecords.emit(outerMarket);
      this.dataSource = new MatTableDataSource<OuterMarketTableModel>(outerMarket);
      this.dataSource.data = outerMarket;
      this.dataSourceOuterMarket.data = outerMarket; // only for copy the original data -> not modified
      this.dataSourceFiltered.data = outerMarket; // only for copy the original data -> not modified
      this.invitedLength = outerMarket.filter(i => i.invitationStatus === InvitationStatus.INVITED).length;
      this.onBoardedLength = outerMarket.filter(i => i.invitationStatus === InvitationStatus.ONBOARDED).length;
      this.allLength = this.dataSource.data.length;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.changePage({ length: this.dataSource.data.length, pageSize: 10 });
      this.pageIndex = this.page.pageIndex + 1;
    }
  }
  @Input() clearTable: boolean;
  @Input() searchedColumn: string;
  @Input() filterValue: string;
  @Input() invitedSuppliers: number[] = [];

  public get isAdmin() {
    return this.apiService.sessionObject.role === 'admin' || this.apiService.sessionObject.role === 'superadmin' || localStorage.getItem('isAdmin') === 'portalAdmin';
  }


  @Output() allRecords = new EventEmitter<OuterMarketTableModel[]>();
  @Output() selectedRowItems = new EventEmitter<OuterMarketTableModel[]>();
  @Output() onBoardSelectedItem = new EventEmitter<OuterMarketTableModel>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatPaginator, { static: true }) page: MatPaginator;
  @ViewChild('onBoardRadio') onBoardRadio: ElementRef;
  @ViewChild('invitedButton') invitedButton: ElementRef;


  columnsToDisplay = [
    'action',
    'invitationStatus',
    'company',
    'taxonomy',
    'country',
    'totalFunding',
    'latestFundingRound',
    'mosaic',
  ];

  dataSource: MatTableDataSource<OuterMarketTableModel> = new MatTableDataSource<OuterMarketTableModel>();
  dataSourceOuterMarket: MatTableDataSource<OuterMarketTableModel> = new MatTableDataSource<OuterMarketTableModel>();
  dataSourceFiltered: MatTableDataSource<OuterMarketTableModel> = new MatTableDataSource<OuterMarketTableModel>();
  selection = new SelectionModel<OuterMarketTableModel>(true, []);
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: OuterMarketTableModel | null;
  invitedLength: number;
  onBoardedLength: number;
  allLength: number;
  invitedLabel: string = InvitationStatus.INVITED;
  onBoardedLabel: string = InvitationStatus.ONBOARDED;
  pageIndex: number;
  pagesLength: number;
  disabled = false;
  isOnboard = false;
  isActive = true;

  ngOnInit() {

    if (this.isAdmin) {
      this.columnsToDisplay.push('onBoard');
      this.columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
      if (this.invitedButton) {
        this.isActive = false;
        this.activeTab(this.invitedButton, InvitationStatus.INVITED);
      }
    }
    this.paginator._intl.itemsPerPageLabel = 'Rows per page:';
    this.filterService.filterOverview.subscribe(data => {
      if (data.sent) {
        this.dataSource.data = this.filterService.setFilteredData(this.dataSourceOuterMarket.data, data.resultFilteredData);
        this.dataSourceFiltered.data = [...this.dataSource.data];
        this.getDataTable(null);
        this.invitedLength = this.dataSource.data.filter(i => i.invitationStatus === InvitationStatus.INVITED).length;
        this.onBoardedLength = this.dataSource.data.filter(i => i.invitationStatus === InvitationStatus.ONBOARDED).length;
        this.allLength = this.dataSource.data.length;
        data.sent = false;
      }
    });

    this.dataSource.data.forEach(data => {
      this.isOnboard = data.invitationStatus === InvitationStatus.ONBOARDED;
    });

    const paginatorIntl = this.paginator._intl;
    paginatorIntl.nextPageLabel = '';
    paginatorIntl.previousPageLabel = '';
  }

  ngOnChanges(changes: any) {
    if (changes.clearTable && changes.clearTable?.previousValue !== changes.clearTable?.currentValue) {
      if (this.clearTable) {
        this.selection.clear();
        if (this.onBoardRadio) {
          (this.onBoardRadio as any).checked = false;
        }
      }
    }

    if (this.isAdmin) {
      if (changes.loading && changes.loading?.previousValue !== changes.loading?.currentValue) {
        if (this.invitedButton) {
          this.activeTab(this.invitedButton, InvitationStatus.INVITED);
        }
      }
    }

    this.changeSearchedColumn();
    if (changes.searchedColumn && changes.searchedColumn?.previousValue !== changes.searchedColumn?.currentValue) {
      this.changeSearchedColumn();
    }

    if (changes.filterValue && changes.filterValue?.previousValue !== changes.filterValue?.currentValue) {
      this.dataSource.filter = this.filterValue;
      this.invitedLength = this.dataSource.filteredData.filter(i => i.invitationStatus === InvitationStatus.INVITED).length;
      this.onBoardedLength = this.dataSource.filteredData.filter(i => i.invitationStatus === InvitationStatus.ONBOARDED).length;

      if (changes.filterValue.currentValue !== '') {
        this.allLength = this.dataSource.filteredData.length;
      } else {
        this.allLength = this.dataSourceOuterMarket.data.length;
      }
    }
    this.ref.detectChanges();
  }

  onChangeStatusToOnBoard(element: OuterMarketTableModel) {
    this.isOnboard = !this.isOnboard;
    this.onBoardSelectedItem.emit(element);
  }

  changeSearchedColumn() {
    const searchedColumn = this.searchedColumn;
    this.dataSource.filterPredicate = (record, filter) => {
      if (searchedColumn === 'company') {
        return this.filterPredicateCompany(record, filter);
      } else {
        return this.filterPredicateAll(record, filter);
      }
    };
  }

  isAllSelected(): boolean {
    const numSelected = this.getItemsByStatus(this.selection.selected).length;
    const numRows = this.getItemsByStatus(this.dataSource.data).length;
    this.selectedRowItems.emit(this.getItemsByStatus(this.selection.selected));

    return numSelected === numRows;
  }

  toggleAllRows(): void | null {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: OuterMarketTableModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.orgId + 1}`;
  }

  setStatusColor(status: any) {
    switch (status) {
      case InvitationStatus.ONBOARDED:
        return InvitationStatus.ONBOARDED;
      case InvitationStatus.INVITED:
        return InvitationStatus.INVITED;
      case InvitationStatus.NOT_INVITED:
        return InvitationStatus.NOT_INVITED;

      default:
        throw new Error(`Non-existent status in switch: ${status}`);
    }
  }

  getItemsByStatus(data: OuterMarketTableModel[]) {
    if (this.isAdmin) {
      return data.filter(i => i.invitationStatus === InvitationStatus.INVITED);
    } else {
      return data.filter(i => i.invitationStatus === InvitationStatus.NOT_INVITED);
    }
  }

  getDataTable(status: string | null) {
    this.selection.clear();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    const data = this.dataSourceFiltered.data;
    switch (status) {
      case InvitationStatus.ONBOARDED:
        return this.dataSource.data = data.filter(i => i.invitationStatus === InvitationStatus.ONBOARDED);
      case InvitationStatus.INVITED:
        return this.dataSource.data = data.filter(i => i.invitationStatus === InvitationStatus.INVITED);
      default:
        return this.dataSource.data = data;
    }
  }

  activeTab(event, status: string) {
    if (event.target) {
      event.target.parentElement.querySelectorAll('button').forEach(element => element.classList.remove('active'));
      event.target.classList.add('active');
    } else {
      document.querySelectorAll('button').forEach(element => element.classList.remove('active'));
      event.nativeElement.classList.add('active');
    }

    this.getDataTable(status);
    if (this.isAdmin) {
      this.disabled = this.getDataTable(status).filter(i => i.invitationStatus === InvitationStatus.INVITED).length === 0 ? true : false;
    } else {
      this.disabled = this.getDataTable(status).filter(i => i.invitationStatus === InvitationStatus.NOT_INVITED).length === 0 ? true : false;
    }
  }

  disabledClass(element: any) {
    if (this.isAdmin && (element.invitationStatus === InvitationStatus.INVITED || element.invitationStatus === InvitationStatus.ONBOARDED)) {
      return 'disabled';
    } else if (!this.isAdmin && (element.invitationStatus === InvitationStatus.NOT_INVITED || element.invitationStatus === InvitationStatus.ONBOARDED)) {
      return 'disabled';
    } else {
      return '';
    }
  }

  disabledItems(element: any, row: any) {
    if (this.invitedSuppliers.includes(row.orgId) || !this.isAdmin && (element.invitationStatus === InvitationStatus.INVITED || element.invitationStatus === InvitationStatus.ONBOARDED)) {
      return true;
    } else if (this.invitedSuppliers.includes(row.orgId) || this.isAdmin && (element.invitationStatus === InvitationStatus.NOT_INVITED || element.invitationStatus === InvitationStatus.ONBOARDED)) {
      return true;
    } else {
      return false;
    }
  }

  checkedItems(element: any, row: any) {
    if (!this.isAdmin && (element.invitationStatus === InvitationStatus.INVITED || element.invitationStatus === InvitationStatus.ONBOARDED)) {
      return false;
    } else if (this.isAdmin && (element.invitationStatus === InvitationStatus.NOT_INVITED || element.invitationStatus === InvitationStatus.ONBOARDED)) {
      return false;
    } else {
      return this.selection.isSelected(row);
    }
  }

  isRowMark(row: any) {
    if (this.isAdmin && (row.invitationStatus === InvitationStatus.INVITED || row.invitationStatus === InvitationStatus.ONBOARDED)) {
      return true;
    } else if (!this.isAdmin && (row.invitationStatus === InvitationStatus.NOT_INVITED || row.invitationStatus === InvitationStatus.ONBOARDED)) {
      return true;
    } else {
      return false;
    }
  }

  openLink(url: string) {
    window.open('//' + url, '_blank');
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  changePage(event) {
    this.pagesLength = Math.round(event.length / event.pageSize);
    this.pageIndex = event.pageIndex + 1;
  }

  private filterPredicateAll(record: any, filter: string) {
    return record.country.toLocaleLowerCase().includes(filter.toLocaleLowerCase()) ||
      record.invitationStatus.toLocaleLowerCase().includes(filter.toLocaleLowerCase()) ||
      record.description.toLocaleLowerCase().includes(filter.toLocaleLowerCase()) ||
      record.company.toLocaleLowerCase().includes(filter.toLocaleLowerCase()) ||
      record.taxonomy.toLocaleLowerCase().includes(filter.toLocaleLowerCase()) ||
      record.latestFundingRound.toLocaleLowerCase().includes(filter.toLocaleLowerCase()) ||
      record.competitors && record.competitors.length && record.competitors.some(c => c.toLocaleLowerCase().includes(filter.toLocaleLowerCase())) ||
      record.acquirers && record.acquirers.length && record.acquirers.some(c => c.toLocaleLowerCase().includes(filter.toLocaleLowerCase())) ||
      record.investors && record.investors.length && record.investors.some(c => c.toLocaleLowerCase().includes(filter.toLocaleLowerCase())) ||
      String(record.totalFunding).includes(String(filter)) ||
      String(record.mosaic).includes(String(filter)) ||
      String(record.latestFundingAmount).includes(String(filter)) ||
      String(record.latestFundingDate).includes(String(filter)) ||
      String(record.latestRevenueMin).includes(String(filter)) ||
      String(record.latestRevenueMax).includes(String(filter)) ||
      String(record.revenueTimePeriod).includes(String(filter)) ||
      String(record.latestValuation).includes(String(filter));
  }

  private filterPredicateCompany(record: any, filter: string) {
    return record.company.toLocaleLowerCase().includes(filter.toLocaleLowerCase());
  }

  toggleDetailRow($event, element) {
    this.expandedElement = this.expandedElement === element ? null : element;
    $event.stopPropagation();
  }

  public getPageLength() {
    return Math.ceil(this.dataSource.data.length / this.page.pageSize);
  }

  public formatFundingData(val: string) {
    return val ? moment(val, 'DD/MM/yyyy').format('MMM DD YYYY') : 'n/a';
  }
}

