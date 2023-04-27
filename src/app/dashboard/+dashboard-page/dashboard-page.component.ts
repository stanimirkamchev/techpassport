import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, filter, take, switchMap, takeUntil, debounceTime } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { DashboardKPIs, DashboardAlerts, DashboardSecurityTrends, DashboardProject, DashboardResources, BankShortlistItem } from '../store/dashboard.model';
import { State } from '../store/dashboard.reducer';
import * as dashboardSelectors from './../store/dashboard.selectors';
import * as dashboardActions from './../store/dashboard.actions';
import { FormGroup, FormControl } from '@angular/forms';
import { Destroyable } from '@abstract/destroyable';
import { filterDebounce } from '@models/filters';
import { filterDashboard } from '../store/dashboard.actions';
import { ApiService } from '@services/api/api.service';
import { InviteModalNewComponent } from 'src/app/portal/invite-modal-new/invite-modal-new.component';
import { PopUpService } from '@shared/pop-up-service';
import { ActivatedRoute, Router } from '@angular/router';
import { PageService } from '@shared/page-service';
import { InvitePreviewModalComponent } from 'src/app/invite-suppliers-module/invite-preview-modal/invite-preview-modal.component';

@Component({
  templateUrl: './dashboard-page.component.html',
  selector: 'dashboard-page',
  styleUrls: ['./dashboard-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent extends Destroyable implements OnInit {
  @Input() bankContextAware: boolean;
  bankShortlist$: Observable<BankShortlistItem[]>;
  viewAllToggle = false;
  refreshTables = false;
  role = '';
  customerID = null;
  productsCount: 0;
  alertsNewest = [];
  alertsOldest = [];
  alertsLoading = true;
  viewInvitationsBtn = false;
  kpis$: Observable<DashboardKPIs>;
  alerts$: Observable<DashboardAlerts>;
  trends$: Observable<DashboardSecurityTrends>;
  projects$: Observable<DashboardProject[]>;
  resources$: Observable<DashboardResources>;
  products$: Observable<DashboardResources>;
  favoriteProducts$: Observable<any>;
  kpisLoading$: Observable<boolean>;
  alertsLoading$: Observable<boolean>;
  trendsLoading$: Observable<boolean>;
  projectsLoading$: Observable<boolean>;
  resourcesLoading$: Observable<boolean>;
  productsLoading$: Observable<boolean>;
  favoriteProductsLoading$: Observable<boolean>;
  formGroup = new FormGroup({
    bankContext: new FormControl(''),
    dateFrom: new FormControl(''),
    dateTo: new FormControl(''),
    country: new FormControl(''),
    entity: new FormControl(''),
    businessDepartment: new FormControl(''),
  });
  countries = ['GB', 'SG'];
  showWatchlists = false;
  selectedProducts: any[] = [];
  refreshWL = 0;

  public get isAdmin() {
    return this.apiService.sessionObject.role === 'admin' || this.apiService.sessionObject.role === 'superadmin' || localStorage.getItem('isAdmin') === 'portalAdmin';
  }

  constructor(
    private pageService: PageService,
    private router: Router,
    private route: ActivatedRoute,
    private popUpService: PopUpService,
    private inviteDialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    public apiService: ApiService,
    private store: Store<State>) {
    super();
    this.store.select(dashboardSelectors.selectFavoriteCount).subscribe(resData => {
      this.productsCount = resData;
    });
  }

  ngOnInit() {
    this.customerID = this.apiService.sessionObject.id;
    this.initDt();
    this.refresh();
  }

  refreshIcon() {
    this.refreshTables = true;
    setTimeout(() => {
      this.refreshTables = false;
    }, 600);
  }

  refresh() {
    this.store.dispatch(dashboardActions.loadDashboard({ filters: {} }));
    this.store.dispatch(dashboardActions.loadProducts({ customerID: this.customerID, chunk: 'partial' }));
    this.store.dispatch(dashboardActions.loadFavoriteProducts({ customerID: this.customerID }));
  }

  initDt() {
    if (this.bankContextAware) {
      console.log(this.bankContextAware);

      if (this.isAdmin) {
        this.bankShortlist$ = this.store.select(dashboardSelectors.selectDashboardBankShortlistLoaded)
          .pipe(tap(loaded => !loaded && this.store.dispatch(dashboardActions.loadBanksShortlist())))
          .pipe(filter(loaded => !!loaded), take(1))
          .pipe(switchMap(_ => this.store.select(dashboardSelectors.selectDashboardBankShortlist)));

        this.store.select(dashboardSelectors.selectDashboardBankShortlistSelected)
          .pipe(takeUntil(this.destroyed$))
          .subscribe(bankContext => this.formGroup.get('bankContext').setValue(bankContext));

        this.formGroup.get('bankContext').valueChanges
          .pipe(takeUntil(this.destroyed$))
          .subscribe(bankContext => {
            this.store.dispatch(dashboardActions.loadProjects({ filters: { bankContext } }));
            this.store.dispatch(dashboardActions.loadResources({ filters: { bankContext } }));
          });

        this.projects$ = this.store.select(dashboardSelectors.selectDashboardProjects);
        this.resources$ = this.store.select(dashboardSelectors.selectDashboardResources);
      }
    }
    else {
      this.projects$ = this.store.select(dashboardSelectors.selectDashboardProjectsLoaded)
        .pipe(tap(loaded => !loaded && this.store.dispatch(dashboardActions.loadProjects({ filters: {} }))))
        .pipe(filter(loaded => !!loaded), take(1))
        .pipe(switchMap(_ => this.store.select(dashboardSelectors.selectDashboardProjects)));

      if (this.isAdmin) {
        this.resources$ = this.store.select(dashboardSelectors.selectDashboardResourcesLoaded)
          .pipe(tap(loaded => !loaded && this.store.dispatch(dashboardActions.loadResources({ filters: {} }))))
          .pipe(filter(loaded => !!loaded), take(1))
          .pipe(switchMap(_ => this.store.select(dashboardSelectors.selectDashboardResources)));
      }
    }

    this.projectsLoading$ = this.store.select(dashboardSelectors.selectDashboardProjectsLoading);
    this.resourcesLoading$ = this.store.select(dashboardSelectors.selectDashboardResourcesLoading);

    this.alertsLoading$ = this.store.select(dashboardSelectors.selectDashboardAlertsLoading);
    this.alerts$ = this.store.select(dashboardSelectors.selectDashboardAlertsLoaded)
      .pipe(tap(loaded => !loaded && !this.bankContextAware && this.store.dispatch(dashboardActions.loadAlerts({ filters: {} }))))
      .pipe(filter(loaded => !!loaded), take(1))
      .pipe(switchMap(_ => this.store.select(dashboardSelectors.selectDashboardAlerts)));

    if (this.isAdmin) {
      this.kpisLoading$ = this.store.select(dashboardSelectors.selectDashboardKpisLoading);
      this.kpis$ = this.store.select(dashboardSelectors.selectDashboardKpisLoaded)
        .pipe(tap(loaded => !loaded && !this.bankContextAware && this.store.dispatch(dashboardActions.loadKPIs({ filters: {} }))))
        .pipe(filter(loaded => !!loaded), take(1))
        .pipe(switchMap(_ => this.store.select(dashboardSelectors.selectDashboardKpis)));

      this.trendsLoading$ = this.store.select(dashboardSelectors.selectDashboardTrendsLoading);
      this.trends$ = this.store.select(dashboardSelectors.selectDashboardTrendsLoaded)
        .pipe(tap(loaded => !loaded && !this.bankContextAware && this.store.dispatch(dashboardActions.loadTrends({ filters: {} }))))
        .pipe(filter(loaded => !!loaded), take(1))
        .pipe(switchMap(_ => this.store.select(dashboardSelectors.selectDashboardTrends)));
    }


    this.formGroup.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .pipe(debounceTime(filterDebounce))
      .subscribe(filters => this.store.dispatch(filterDashboard({ filters })));

    // Products
    // this.store.dispatch(dashboardActions.loadProducts({ customerID: this.customerID, chunk: 'partial' }));
    this.productsLoading$ = this.store.select(dashboardSelectors.selectDashboardProductsLoading);
    this.products$ = this.store.select(dashboardSelectors.selectDashboardProductsLoaded)
      .pipe(tap(loaded => !loaded && this.store.dispatch(dashboardActions.loadProducts({ customerID: this.customerID, chunk: 'partial' }))))
      .pipe(filter(loaded => !!loaded), take(1))
      .pipe(switchMap(_ => this.store.select(dashboardSelectors.selectDashboardProducts)));

    // Favorite Products
    // this.store.dispatch(dashboardActions.loadFavoriteProducts({ customerID: this.customerID }));
    this.favoriteProductsLoading$ = this.store.select(dashboardSelectors.selectDashboardFavoriteProductsLoading);
    this.favoriteProducts$ = this.store.select(dashboardSelectors.selectDashboardFavoriteProductsLoaded)
      .pipe(tap(loaded => !loaded && this.store.dispatch(dashboardActions.loadFavoriteProducts({ customerID: this.customerID }))))
      .pipe(filter(loaded => !!loaded), take(1))
      .pipe(switchMap(_ => this.store.select(dashboardSelectors.selectDashboardFavoriteProducts)));

    this.alertsLoading = true;
    this.apiService.getAlertProducts().pipe(take(1)).subscribe((res: any) => {
      if (res) {
        this.alertsNewest = res.newest;
        this.alertsOldest = res.oldest;
        this.alertsLoading = false;
        this.cdRef.detectChanges();
      }
    });
  }

  openMarketPreview(customerID = '') {
    this.store.dispatch(dashboardActions.loadMarketPreview({ customerID }));
  }

  openSearchesPreview(customerID = '') {
    this.store.dispatch(dashboardActions.loadSearchesPreview({ customerID }));
  }

  openTechnologyPreview(customerID = '') {
    this.store.dispatch(dashboardActions.loadTechnologyPreview({ customerID }));
  }

  openTrendsPreview(customerID = '') {
    this.store.dispatch(dashboardActions.loadTrendsPreview({ customerID }));
  }

  changeViewToggleBtn(val: boolean) {
    this.viewAllToggle = val;
  }

  inviteNew(): void {
    const ref = this.inviteDialog.open(InviteModalNewComponent, {
      width: '728px',
      height: 'auto',
      maxWidth: undefined,
      disableClose: true,
      panelClass: 'termsDialogModal',
      // data: { url: url },
    });
    ref.afterClosed().subscribe((result) => { });
  }

  viewInvitations(show: boolean): void {
    if (this.apiService.sessionObject.level === 3 && show) {
      this.openInviteModal();
    } else {
      this.viewInvitationsBtn = show;
    }
  }

  addProductToFavorite(product: any) {
    this.apiService.dashboardAddFavoriteProduct(this.customerID, product.product._id, product.product.supplierEntity._id).subscribe((res) => {
      if (res.body) {
        this.store.dispatch(dashboardActions.loadFavoriteProducts({ customerID: this.customerID }));
      }
    });
  }

  removeFavoriteItem(watchList: any) {
    this.apiService.dashboardRemoveFavoriteProduct(this.customerID, watchList?.product?._id).subscribe((res) => {
      if (res.body) {
        this.store.dispatch(dashboardActions.loadFavoriteProducts({ customerID: this.customerID }));
      }
    });
  }

  removeAllFavoriteItems() {
    this.apiService.dashboardRemoveAllFavoriteProducts(this.customerID).subscribe((res) => {
      if (res.body) {
        this.store.dispatch(dashboardActions.loadFavoriteProducts({ customerID: this.customerID }));
      }
    });
  }

  navigateToMarketPlace() {
    const page = 'market';
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: { page },
    });
    this.pageService.emitValue(page);
  }

  resetForm() {
    this.formGroup.controls.country.setValue('');
    this.formGroup.controls.dateTo.setValue('');
    this.formGroup.controls.dateFrom.setValue('');
    this.formGroup.controls.entity.setValue('');
  }

  goToWatchlists() {
    this.router.navigate(['portal'], {
      queryParams: {
        page: 'watchlist'
      }
    });
  }

  closeWatchlistModal() {
    this.showWatchlists = false;
    this.refreshWL += 1;
    this.selectedProducts = [];
  }

  addProductToWatchList(product) {
    if (this.selectedProducts.indexOf(product._id) > -1) {
      this.selectedProducts = [];
      this.showWatchlists = false;
    } else {
      this.selectedProducts.push(product._id);
      this.showWatchlists = true;
    }
  }

  openInviteModal() {
    const ref = this.inviteDialog.open(InvitePreviewModalComponent, {
      width: '728px',
      height: 'auto',
      maxWidth: undefined,
      disableClose: true,
      panelClass: 'termsDialogModal',
      data: {},
    });

    ref.afterClosed().pipe(take(1)).subscribe(result => {
      switch (result.goTo) {
        case 'close':
          break;
        case 'full_page':
          this.viewInvitationsBtn = true;
          break;
        case 'invite':
          this.inviteNew();
          break;
        default:
          break;
      }
    });
  }
}
