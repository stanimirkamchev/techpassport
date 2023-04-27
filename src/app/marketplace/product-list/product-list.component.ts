import { SelectionModel } from '@angular/cdk/collections';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api/api.service';
import { FISModalComponent } from '../FIS-modal/FIS-modal.component';
import { FilterService } from '@shared/filter-service';
import { getCode, getName } from 'country-list';
import { ProductModalComponent } from '../../portal/product-modal/product-modal.component';
import { TFilterDetail } from '@shared/types/TFilterDetail';
import { Observable } from 'rxjs';

export interface ProductModel {
  name: string;
  company: string;
  matchPercentage: number;
  fundingRound: string;
  estTime: Date;
  details: string;
  trialFee: boolean;
  PIData: boolean;
  POCs: number;
  fisWorkedWith: number;
  ratingProduct: number;
  ratingERQ: number;
  likes: number;
  _id: string;
  supplier: any;
}

@Component({
  selector: 'product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnChanges {
  @Input() showWatchlists: boolean;
  @Input() marked: boolean;
  @Input() loading: Observable<boolean>;

  @Output() toggleWatchList = new EventEmitter<boolean>();
  @Output() openWatchLists = new EventEmitter();

  @Input() set tableData(tableData: any[]) {
    if (tableData) {
      this.dataSource.data = tableData.map(item => {
        return ({
          raw: item,
          name: item.name,
          company: item.supplier.name,
          matchPercentage: 50,
          fundingRound: item.supplier.companyStage,
          estTime: item.supplier.incorporated,
          details: item.functionality,
          trialFee: item.productdetails?.charges?.trial !== 'free' || item.productdetails?.charges?.chargesTrialFee === 'yes',
          charges: item.productdetails?.charges,
          PIData: item.productdetails?.access?.personalDataTransfer,
          POCs: item.pocCount,
          fisWorkedWith: Array.isArray(item.supplier?.experience)
            ? item.supplier?.experience
              .map(subitem =>
                Number(subitem.global || 0) + Number(subitem.serviceAgreements || 0) + Number(subitem.regional || 0) + Number(subitem.poc || 0))
              .reduce((sum, el) => sum + el, 0)
            : 0,
          ratingProduct: 3,
          ratingERQ: 3,
          likes: 10,
          experience: item.supplier.experience,
          location: getName(item.supplier.country || 'UK'),
          companyAgeYear: Math.floor(item.companyAgeInYear),
          companyAgeMonth: Math.floor((item.companyAgeInYear - Math.floor(item.companyAgeInYear)) * 12),
          supplierId: item.supplierEntity,
          supplier: item.supplier,
          hostLocation: item.productdetails?.details?.productHosting?.hostLocation,
          _id: item._id,
          id: item._id,
          productDetailId: item.productdetails._id,
          compliant: item.compliant,
          completed: item.completed,
          watchlistsCount: item.watchlistsCount,
          taxonomy: item.productdetails && item.productdetails.details && item.productdetails.details.type
            ? [...new Set(item.productdetails.details.type.flatMap((a: string) => a?.split('-')[0]?.trim()))]
            : '-'
        });
      });

      this.dataSource.data = this.dataSource.data.sort((a, b) => b.compliant - a.compliant);

      this.dataSourceAll.data = [...this.dataSource.data];
      this.total = tableData.length;
      this.filterService.setPagination({ total: this.total, dataCount: tableData.length });
      this.filterService.setResTotalData(this.total);
      const selectedProducts = this.selection.selected;
      this.dataSourceFiltered.data = [...this.dataSource.data];
      this.dataSource.data = [...this.dataSource.data.slice(...this.sliceParams())];
      this.dataSource.data.forEach((product) => {
        const existProduct = selectedProducts.find((item) => item._id === product._id);
        if (existProduct) {
          this.filterService.replaceData(existProduct, product);
        }
      });
    }
  }

  dataSource = new MatTableDataSource<any>();
  dataSourceFiltered = new MatTableDataSource<any>();
  dataSourceAll = new MatTableDataSource<any>();
  selection: SelectionModel<any>;
  pageIndex = 1;
  pageSize = 10;
  total;
  filterDetail: TFilterDetail;
  customerId: string;
  isAdding = false;
  selectedProductId = '';
  progressBar: { [key: string]: { completed: number, compliant: number } } = {
    total: {
      completed: 0,
      compliant: 0
    }
  };

  displayedColumns = [
    'icon',
    'product',
    'details',
    'taxonomy',
    'fundingRound',
    'trialfee',
    'pidata',
    'poc',
    'fisWorkedWith',
    // 'ratings',
    'action'
  ];

  constructor(
    private addDialog: MatDialog,
    private apiService: ApiService,
    private filterService: FilterService,
  ) {
    this.filterService.clearFilter();
    this.filterService.clearSelectedData();
  }

  ngOnInit(): void {
    this.customerId = this.apiService.sessionObject.id;

    this.filterService.filterOverview.subscribe(data => {
      this.dataSource.data = [...this.dataSourceAll.data];
      this.dataSource.filter = data.search;
      this.dataSource.data = this.filterService.setFiltereMarketplaceData(
        this.dataSource.data,
        data.resultFilteredData,
        data.sortBy
      );

      this.total = this.dataSource.filteredData.length;
      this.filterService.setPagination({ total: this.total, dataCount: this.dataSource.filteredData.length });
      this.filterService.setResTotalData(this.total);
      this.dataSourceFiltered.data = [...this.dataSource.filteredData];
      this.dataSource.data = [...this.dataSource.filteredData.slice(...this.sliceParams())];
    });

    this.filterService.filterSelectAllOverview.subscribe((res) => {
      if (res) {
        const selectedProducts = this.selection.selected;
        this.dataSource.data.forEach((product) => {
          const existProduct = selectedProducts.find((item) => item._id === product._id);
          if (existProduct) {
            this.filterService.unselectData(existProduct);
          }
        });
        this.filterService.setSelectedData(this.dataSource.data);
      }
    });

    this.filterService.selectedDataOverview.subscribe((res) => {
      this.selection = res;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.showWatchlists && !changes.showWatchlists.firstChange && changes.showWatchlists.currentValue === false) {
      // this.searchProduct(true);
    }
  }

  checkboxLabel(row?: any): string {
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.orgId + 1}`;
  }

  openFISDialog(element) {
    const ref = this.addDialog.open(FISModalComponent, {
      width: '1200px',
      height: '676px',
      maxWidth: undefined,
      panelClass: 'modal',
      disableClose: false,
      data: element.experience
    });
    ref.afterClosed().subscribe(() => {
      // this.clearTable = true;
    });

    // this.clearTable = false;
  }

  toggleSelection(row) {
    this.filterService.toggleData(row);
    this.toggleWatchList.emit(true);
  }

  addSelection(row) {
    if (this.showWatchlists) {
      return;
    }
    this.filterService.clearSelectedData();
    this.filterService.toggleData(row);
    this.toggleWatchList.emit(true);
    this.openWatchLists.emit();
    this.isAdding = true;
  }

  onPageSizeChange(event) {
    this.pageSize = event;
    this.pageIndex = 1;
    this.filterService.setPagination({
      pageSize: this.pageSize,
      pageIndex: this.pageIndex
    });
    this.dataSource.data = [...this.dataSourceFiltered.data.slice(...this.sliceParams())];
  }

  onPageIndexChange() {
    this.filterService.setPagination({
      pageIndex: this.pageIndex
    });
    this.dataSource.data = [...this.dataSourceFiltered.data.slice(...this.sliceParams())];
  }

  openProductModal(row) {
    const ref = this.addDialog.open(ProductModalComponent, {
      width: '580px',
      height: '100%',
      maxWidth: undefined,
      panelClass: 'product-modal',
      disableClose: false,
      data: { productId: row.id }
    });
    ref.afterClosed().subscribe(() => {
      // after close
    });
  }

  roundNumber(val: any) {
    return Number(val).toFixed(0);
  }

  private getCountryCode(item: any) {
    if (item === 'European Union') {
      return 'EU';
    }
    return getCode(item);
  }

  private sliceParams() {
    return [(this.pageIndex - 1) * this.pageSize, this.pageSize + (this.pageIndex - 1) * this.pageSize];
  }
}
