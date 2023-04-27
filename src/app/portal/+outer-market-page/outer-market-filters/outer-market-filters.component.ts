import {
  Component,
  OnInit, Input, Output, AfterViewInit,
  EventEmitter, ViewChildren, QueryList, ViewChild, ElementRef, HostListener, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { OuterMarketTableModel } from '../outerMarket.models';
import { Store } from '@ngrx/store';
import { State } from '../store/index.reducer';
import { ApiService } from '@services/api/api.service';
import { Observable } from 'rxjs';
import { FilterService } from '@shared/filter-service';

@Component({
  selector: 'outer-market-filters',
  templateUrl: './outer-market-filters.component.html',
  styleUrls: ['./outer-market-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OuterMarketFiltersComponent implements OnInit, AfterViewInit {

  constructor(
    private apiService: ApiService,
    private store: Store<State>,
    inputSearchValue: ElementRef,
    private filterService: FilterService,
    private cd: ChangeDetectorRef,
  ) {
    this.inputSearch = inputSearchValue;
  }

  loaded$: Observable<boolean>;
  searchedColumn: string;
  searchedText = '';
  openSearch = false;
  omDataTable: any;
  isPassCompanyCheck = false;
  isPassAllCheck = false;
  companySearchText: null | string;
  allSearchText: null | string;
  searches: string[];
  filterResCounter = 0;

  @Input() selectedRows: OuterMarketTableModel[];
  @Input() loaded: boolean;
  @Input() isFilterActive: boolean;
  @Output() onClickInviteSelected = new EventEmitter<OuterMarketTableModel[]>();
  @Output() onClickCancelInvited = new EventEmitter<OuterMarketTableModel[]>();
  @Output() onSubmitFilterValue = new EventEmitter<string>();
  @Output() searchByFilterColumn = new EventEmitter<string>();
  @Output() onClickOpenFilterModal = new EventEmitter<any>();

  @ViewChildren('filters') filters: QueryList<ElementRef>;
  @ViewChild('inputSearch', { static: true }) inputSearch: ElementRef;
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.onClearSearch();
    (document.activeElement as any).blur();
    (document.querySelector('body') as any).click();
  }

  @HostListener('document:keydown.enter', ['$event']) onKeyHandler(event: KeyboardEvent) {
    this.onClickEnterButton();
    (document.activeElement as any).blur();
    (document.querySelector('body') as any).click();
  }

  public get isAdmin() {
    return this.apiService.sessionObject.role === 'admin' || this.apiService.sessionObject.role === 'superadmin';
  }

  ngOnInit(): void {
    this.selectedRows = [];

    this.store.select(state => state).subscribe(data => {
      if (this.loaded) {
        this.omDataTable = (data as any).outerMarket.data;
      }
    });

    this.filterService.filterCounterOverview.subscribe((data: number) => {
      this.filterResCounter = data;
    });
  }

  ngAfterViewInit(): void {
    const selector = document.querySelector('.mat-drawer-content');
    if (selector) {
      selector.addEventListener('scroll', (event) => {
        if ((event.target as any).scrollTop > 100) {
          document.querySelector('.filters').classList.add('scroll');
        } else {
          document.querySelector('.filters').classList.remove('scroll');
        }
      });
    }
  }

  onClickEnterButton() {
    this.openSearch = false;
    this.onSubmitFilterValue.emit(this.searchedText.trim().toLowerCase());
    this.sendOmSearchPreviewRequest(null);
  }

  onClearSearch() {
    (document.querySelector('.filters .filter-input') as any).value = '';
    this.searchedText = '';
    this.openSearch = false;
  }

  onKeyUpFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchedText = filterValue;
    this.onSubmitFilterValue.emit(filterValue.trim().toLowerCase());

    this.helperCheck((event.target as any).value);
  }

  onClickOutside(event: any) {
    if (!event.target.classList.contains('searches-preview')) {
      this.onSubmitFilterValue.emit(this.searchedText.trim().toLowerCase());
    }
    if (this.openSearch) {
      this.sendOmSearchPreviewRequest(null);
    }
    this.openSearch = false;
  }

  onChangeSearchColumn(event: any): void {
    this.searchByFilterColumn.emit(event.value);
    this.searchedColumn = event.value;
  }

  onSubmitClickedValue(val: string) {
    this.inputSearch.nativeElement.value = val;
    this.searchedText = val;
    this.onSubmitFilterValue.emit(this.searchedText.trim().toLowerCase());
    this.helperCheck(val);
    if (this.openSearch) {
      this.sendOmSearchPreviewRequest(null);
    }
    this.openSearch = false;
  }

  onInitInitialSearchesData(val) {
    if (val) { this.searches = val; }
  }

  sendOmSearchPreviewRequest(event) {
    if ((this.searchedColumn === 'company' && this.companySearchText && this.companySearchText.length >= 3 && this.isPassCompanyCheck)
      || (this.searchedColumn !== 'company' && this.allSearchText && this.allSearchText.length >= 3 && this.isPassAllCheck)
    ) {
      this.apiService.omSearchPreview(this.allSearchText, this.companySearchText).subscribe(_ => {
        this.isPassAllCheck = false;
        this.isPassCompanyCheck = false;
      });
    }
  }

  helperCheck(text: string) {
    if (this.searchedColumn === 'company') {
      this.allSearchText = null;
      this.companySearchText = text;
    } else {
      this.allSearchText = text;
      this.companySearchText = null;
    }

    if (this.omDataTable && this.omDataTable.length > 0) {
      const all = this.allSearchText ? this.allSearchText.trim().toLowerCase() : null;
      const company = this.companySearchText ? this.companySearchText.trim().toLowerCase() : null;

      this.omDataTable.forEach(i => {
        if (
          i.company
          && company
          && company.length >= 3
          && i.company.trim().toLowerCase().includes(company)
        ) {
          this.isPassCompanyCheck = true;
        }
        if (all
          && all.length >= 3
          && this.findInValues(i, all)
        ) {
          this.isPassAllCheck = true;
        }
      });
    }
  }

  private findInValues(elem: any, value: string) {
    if (!value || value.length < 3) {
      return false;
    }

    value = value.trim().toLowerCase();
    return Object.entries(elem).some(entry => {
      switch (entry[0]) {
        case 'latestFundingAmount':
        case 'latestValuation':
        case 'latestRevenueMax':
        case 'latestRevenueMin':
        case 'mosaic':
        case 'totalFunding':
          return entry[1] ? (entry[1] as any).toString().toLocaleLowerCase().includes(value) : false;
        case 'acquirers':
        case 'investors':
        case 'competitors':
          const arr = entry[1] as string[];
          return arr && arr.length > 0 ? arr.some(e => e.toLocaleLowerCase().includes(value)) : false;
        case 'company':
        case 'description':
        case 'taxonomy':
        case 'latestFundingRound':
        case 'latestFundingDate':
        case 'revenueTimePeriod':
        case 'invitationStatus':
          return entry[1] ? (entry[1] as string).toLocaleLowerCase().includes(value) : false;
        default:
          break;
      }
    });
  }
}
