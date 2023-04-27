import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FilterModalComponent } from '../filter-modal/filter-modal.component';
import { ProductCompareComponent } from '../product-compare/product-compare.component';
import { InformationRequestedComponent } from '../information-requested/information-requested.component';
import { FilterService } from '@shared/filter-service';
import { ApiService } from '@services/api/api.service';
import { Observable } from 'rxjs';
import * as dashboardActions from '../../dashboard/store/dashboard.actions';
import { State } from '../../dashboard/store/dashboard.reducer';
import { Store } from '@ngrx/store';
import { filter, switchMap, take, tap } from 'rxjs/operators';
import { DashboardResources } from '../../dashboard/store/dashboard.model';
import * as dashboardSelectors from '../../dashboard/store/dashboard.selectors';
import { selectDataLoading } from '../store/index.selector';
import * as marketplaceActions from '../store/index.actions';
import * as marketplaceSelectors from '../store/index.selector';
import { addWatchlistCount } from '../store/index.actions';

@Component({
  selector: 'marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss']
})
export class MarketplaceComponent implements OnInit {
  tab = 'all-products';
  selectedCount = 0;
  selectedProducts: any[] = [];
  selectedProductsData: any[] = [];
  customerId = '';
  isAdding = false;
  products$: Observable<DashboardResources>;
  productsLoading$: Observable<boolean>;
  showWatchlists = false;
  marked = false;
  isAddMode = false;
  dataSource$: Observable<any[]>;
  loading$: Observable<boolean>;
  loaded$: Observable<boolean>;

  constructor(
    private addDialog: MatDialog,
    private filterService: FilterService,
    private apiService: ApiService,
    private store: Store<State>
  ) {
  }

  ngOnInit(): void {
    this.customerId = this.apiService.sessionObject.id;
    this.filterService.selectedDataOverview.subscribe((res) => {
      this.selectedCount = res.selected.length;
      this.selectedProductsData = res.selected;
      this.selectedProducts = res.selected.map((item) => item._id);
    });

    this.loading$ = this.store.select(selectDataLoading);
    this.dataSource$ = this.store.select(marketplaceSelectors.selectDataLoaded)
      .pipe(tap(loaded => !loaded && this.store.dispatch(marketplaceActions.loadDataTable())))
      .pipe(filter(loaded => !!loaded), take(1))
      .pipe(switchMap(_ => this.store.select(marketplaceSelectors.selectData)));
    this.loaded$ = this.store.select(marketplaceSelectors.selectDataLoaded);

    this.productsLoading$ = this.store.select(dashboardSelectors.selectDashboardProductsLoading);
    this.products$ = this.store.select(dashboardSelectors.selectDashboardProductsLoaded)
      .pipe(tap(loaded => !loaded && this.store.dispatch(dashboardActions.loadProducts({ customerID: this.customerId, chunk: 'partial' }))))
      .pipe(filter(loaded => !!loaded), take(1))
      .pipe(switchMap(_ => this.store.select(dashboardSelectors.selectDashboardProducts)));
  }

  async addWatchLists() {
    this.showWatchlists = true;
    this.marked = false;
  }

  async openWatchLists() {
    this.showWatchlists = true;
    this.marked = false;
    this.isAddMode = true;
  }

  closeWatchlistModal() {
    this.showWatchlists = false;
    this.marked = false;
    this.filterService.clearSelectedData();
    this.isAddMode = false;
  }

  addedWatchList() {
    this.marked = true;
    this.store.dispatch(addWatchlistCount({ data: this.selectedProducts }));
  }

  toggleWatchList(show: boolean) {
    if (show && this.selectedCount) {
      // this.addWatchLists();
    } else {
      this.closeWatchlistModal();
    }
  }

  onClickOpenFilterModal(): void {
    const ref = this.addDialog.open(FilterModalComponent, {
      width: '360px',
      height: '100%',
      maxWidth: undefined,
      panelClass: 'filter-modal',
      disableClose: false,
      // data: { records: this.records }
    });
    ref.afterClosed().subscribe(result => {
      // this.clearTable = true;
    });

    // this.clearTable = false;
  }

  openProductCompareDialog() {
    this.apiService
      .getCompareProductDetails(this.selectedProducts)
      .pipe(take(1))
      .subscribe((data) => {
        const productDetails = data.body;
        const ref = this.addDialog.open(ProductCompareComponent, {
          width: '1200px',
          minHeight: '900px',
          maxWidth: undefined,
          panelClass: 'modal',
          disableClose: false,
          data: productDetails
        });
        ref.afterClosed().subscribe(result => {
          // this.clearTable = true;
        });
      });

    // this.clearTable = false;
  }
  openInformationRequestDialog() {
    const data = this.selectedProductsData.filter(a => this.selectedProducts.some(p => a._id === p));
    const ref = this.addDialog.open(InformationRequestedComponent, {
      width: '720px',
      minHeight: '450px',
      maxWidth: undefined,
      panelClass: 'modal',
      disableClose: false,
      data: data.map(p => ({
        supplierID: p.supplier._id,
        productID: p._id
      }))
    });
    ref.afterClosed().subscribe(result => {
      // this.clearTable = true;
    });
  }

  addProductToFavorite(product: any) {
    this.apiService.dashboardAddFavoriteProduct(this.customerId, product.product._id, product.product.supplierEntity._id).subscribe((res) => {
      if (res.body) {
        this.store.dispatch(dashboardActions.loadFavoriteProducts({ customerID: this.customerId }));
      }
    });
  }
}
