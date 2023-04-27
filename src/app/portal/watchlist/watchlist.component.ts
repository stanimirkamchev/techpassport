import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '@services/api/api.service';
import { FilterService } from '@shared/filter-service';
import { WatchListService } from './service';
import { MatDialog } from '@angular/material/dialog';
import { RemoveWatchlistsModalComponent } from './partials/remove-watchlists-modal/remove-watchlists-modal.component';
import { CreateWatchlistModalComponent } from './partials/create-watchlist-modal/create-watchlist-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, take } from 'rxjs/operators';
import { filterDebounce } from '@models/filters';
import { getCode } from 'country-list';
import { TFilterDetail } from '@shared/types/TFilterDetail';
import { Observable } from 'rxjs';

@Component({
  selector: 'watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss']
})
export class WatchlistComponent implements OnInit {
  customerId = '';
  myWatchLists = [];
  companyWatchLists = [];
  selectedProductCount = 0;
  loading = false;
  filerDetail: TFilterDetail;
  showWatchlists = false;
  marked = false;
  selectedProducts: any[] = [];
  companyWatchListsSelectedItems$: Observable<boolean>;

  constructor(
    private apiService: ApiService,
    private filterService: FilterService,
    private watchListService: WatchListService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef,
  ) {
    this.filterService.clearFilter();
    this.filterService.clearSelectedData();
    this.watchListService.clear();
  }

  ngOnInit(): void {
    this.customerId = this.apiService.sessionObject.id;

    this.getCompanyWatchLists();

    this.watchListService.selectedProductIdsOverview$.subscribe((res) => {
      this.selectedProductCount = res.reduce((sum, el) => sum + el.productIds.length, 0);
      this.selectedProducts = res.reduce((arr, el) => [...new Set([...arr, ...el.productIds])], []);
      this.cdRef.detectChanges();
    });

    // this.route.queryParams.subscribe(params => {
    //   if (params.token) {
    //     this.apiService.addCollaborator({ inviteToken: params.token });
    //   }
    // });

    this.filterService.filterOverview
      .pipe(debounceTime(filterDebounce))
      .pipe(take(1))
      .subscribe((res) => {
        this.filerDetail = res;
        this.searchWatchLists();
      });

    this.companyWatchListsSelectedItems$ = this.watchListService.companyWatchListItemsSelected$;
  }

  searchWatchLists() {
    const filters = this.filerDetail?.resultFilteredData || {};

    this.loading = true;
    this.apiService.getMyWatchLists({
      ...filters,
      search: this.filerDetail?.search,
      sortBy: this.filerDetail?.sortBy,
      geolocation: filters.geolocation ? filters.geolocation.map((item) => getCode(item)) : [],
      countryOperatingIn: filters.countryOperatingIn ? filters.countryOperatingIn.map((item) => this.getCountryCode(item)) : [],
    }).subscribe((res) => {
      this.myWatchLists = res;
      if (res) {
        const totalPr = res.flatMap(a => a.products);
        this.watchListService.setTotalCount(totalPr ? totalPr.length : 0);
      }
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

  getCompanyWatchLists() {
    this.apiService.getCompanyWatchLists().subscribe((res) => {
      this.companyWatchLists = res;
    });
  }

  openRemoveWatchListsModal() {
    const ref = this.dialog.open(RemoveWatchlistsModalComponent, {
      width: '720px',
      maxWidth: undefined,
      panelClass: 'modal',
      disableClose: false,
    });
    ref.afterClosed().subscribe((res) => {
      if (res === 'success') {
        this.searchWatchLists();
      }
    });
  }

  openCreateModal() {
    const ref = this.dialog.open(CreateWatchlistModalComponent, {
      width: '720px',
      maxWidth: undefined,
      panelClass: 'modal',
      disableClose: false,
      data: { selectedProductIds: this.selectedProducts }
    });
    ref.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.searchWatchLists();
      }
    });
  }

  private getCountryCode(item: any) {
    if (item === 'European Union') {
      return 'EU';
    }
    return getCode(item);
  }

  goToMarketplace() {
    this.router.navigate(['portal'], {
      queryParams: {
        page: 'market'
      }
    });
  }
}
