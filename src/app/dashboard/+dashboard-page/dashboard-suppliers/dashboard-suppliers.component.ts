import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { ProductModalComponent } from '../../../portal/product-modal/product-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { State } from '../../store/dashboard.reducer';
import * as dashboardSelectors from '../../store/dashboard.selectors';
import { FilterService } from '@shared/filter-service';
import { SelectionModel } from '@angular/cdk/collections';
import * as dashboardActions from '../../store/dashboard.actions';
import {ApiService} from '@services/api/api.service';

@Component({
  selector: 'dashboard-suppliers',
  templateUrl: './dashboard-suppliers.component.html',
  styleUrls: ['./dashboard-suppliers.component.scss']
})
export class DashboardSuppliersComponent implements OnInit, OnChanges {
  selection: SelectionModel<any>;
  @Output() openWatchLists = new EventEmitter();

  constructor(
    private addDialog: MatDialog,
    private store: Store<State>,
    private filterService: FilterService,
    private cdRef: ChangeDetectorRef,
    private apiService: ApiService,
  ) {
    this.filterService.clearFilter();
    this.filterService.clearSelectedData();
    this.store.select(dashboardSelectors.selectFavoriteIds).subscribe(resData => {
      if (resData) {
        this.favoriteProductsIds = resData;
      }
    });
  }

  @Input() set products(products: any[]) {
    if (products && products.length > 0) {
      this._products = products.map((item) => ({
        ...item,
        trialFee: item.charges?.trial !== 'free' || item.chargesTrialFee === 'yes',
        PIData: item.access?.personalDataTransfer,
      }));
    }
  }

  @Input() loading: boolean;
  @Output() addFavoriteProduct = new EventEmitter<{}>();
  @Output() addWatchListProduct = new EventEmitter<{}>();
  @Input() showWatchlists: boolean;
  @Input() marked: boolean;
  favoriteProductsIds = [];
  customerId = '';

  _products: any[];

  displayedColumns = [
    'action',
    'product',
    'details',
    'fundingRound',
    'website',
    'nda',
    'rapidPoc',
    'trialFee',
    'piData',
    'view'
  ];

  ngOnInit(): void {
    this.customerId = this.apiService.sessionObject.id;
    this.store.dispatch(dashboardActions.loadProducts({ customerID: this.customerId, chunk: 'partial' }));

    this.filterService.selectedDataOverview.subscribe((res) => {
      this.selection = res;
      this.cdRef.detectChanges();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.showWatchlists && !changes.showWatchlists.firstChange && changes.showWatchlists.currentValue === false) {
      this.store.dispatch(dashboardActions.loadProducts({ customerID: this.customerId, chunk: 'partial' }));
    }
  }

  toggleSelection(element: object) {
    this.filterService.toggleData(element);
    this.addWatchListProduct.emit(element);
  }

  openWatchListsModal(element) {
    if (this.showWatchlists) {
      return;
    }

    this.filterService.clearSelectedData();
    this.toggleSelection(element.product);
    this.openWatchLists.emit();
  }

  openProductModal(element: any) {
    const ref = this.addDialog.open(ProductModalComponent, {
      width: '580px',
      height: '100%',
      maxWidth: undefined,
      panelClass: 'product-modal',
      disableClose: false,
      data: {productId: element.product._id}
    });
    ref.afterClosed().subscribe(result => {
      // after close
    });
  }

  setCountry(element: any) {
    switch (element) {
      case 'gb':
        return 'United Kingdom';
      case 'sg':
        return 'Singapore';
      case 'us':
        return 'United States';
      default:
        return '-';
    }
  }

  setIcon(element: any) {
    const el = String(element).trim();
    switch (el) {
      case 'yes':
        return 'check_circle';
      case 'true':
        return 'check_circle';
      case 'no':
        return 'cancel';
      case 'false':
        return 'cancel';
      default:
        return '-';
    }
  }

  setColor(element: any) {
    const el = String(element).trim();
    switch (el) {
      case 'yes':
        return '#00AF00';
      case 'true':
        return '#00AF00';
      case 'no':
        return '#9CA3AF';
      case 'false':
        return '#9CA3AF';
      default:
        return '#9CA3AF';
    }
  }

}
