import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterService } from '@shared/filter-service';
import { FilterModalComponent } from '../../../../marketplace/filter-modal/filter-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { WatchListService } from '../../service';
import { Observable } from 'rxjs';
import { WatchList } from '../../types/watchlist.type';
import { TFilterDetail } from '@shared/types/TFilterDetail';

@Component({
  selector: 'watchlist-filter',
  templateUrl: './watchlist-filter.component.html',
  styleUrls: ['./watchlist-filter.component.scss']
})
export class WatchlistFilterComponent implements OnInit {
  @Input() watchLists: WatchList[];

  @Output() openFilter = new EventEmitter();

  filters: { name: string, value: string, title: string }[] = [];
  totalCount = 0;
  filterDetail: TFilterDetail;
  isAllSelected = false;
  selectedCount$: Observable<number>;
  pagination: any = {};
  sortByLabel = '';

  constructor(
    private filterService: FilterService,
    private watchlistService: WatchListService,
    private addDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.filterService.filterOverview.subscribe((res) => {
      this.filterDetail = res;
      if (this.filterDetail.sortBy === 'updated') {
        this.sortByLabel = 'Recently updated';
      } else if (this.filterDetail.sortBy === 'newest') {
        this.sortByLabel = 'Newest';
      } else if (this.filterDetail.sortBy === 'oldest') {
        this.sortByLabel = 'Oldest';
      } else if (this.filterDetail.sortBy === 'alphabetic') {
        this.sortByLabel = 'A - Z';
      } else {
        this.filterService.setSortBy('updated');
        this.sortByLabel = 'Recently updated';
      }

      this.filters = [];

      Object.keys(res.outputFilteredData).forEach((key: string) => {
        const value = res.outputFilteredData[key];
        this.filters = this.filters.concat(value.map((item) => ({
          name: key,
          value: item.name,
          title: key === 'taxonomy' ? item.title : item.name
        })));
      });
    });

    this.watchlistService.totalCount$.subscribe(res => {
      this.totalCount = res;
    });

    // this.filterService.filterResCounterOverview.subscribe((res) => {
    //   this.totalCount = res;
    // });
    this.filterService.filterSelectAllOverview.subscribe((res) => {
      this.isAllSelected = res;
    });
    this.filterService.paginationOverview.subscribe((res) => {
      this.pagination = res;
    });

    this.selectedCount$ = this.watchlistService.selectedProductCount$;
  }

  onOpenFilter() {
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

  clearFilter() {
    this.filterService.clearFilter();
  }

  onRemoveFilter(filter: { name: string, value: string }) {
    const resultFilteredData = {
      ...this.filterDetail.resultFilteredData,
      [filter.name]: this.filterDetail.resultFilteredData[filter.name]?.filter((item) => item !== filter.value)
    };

    const outputFilteredData = {
      ...this.filterDetail.outputFilteredData,
      [filter.name]: this.filterDetail.outputFilteredData[filter.name]?.filter((item) => item.name !== filter.value)
    };
    this.filterService.attachData({
      sent: false,
      outputFilteredData,
      resultFilteredData
    });
  }

  selectAll() {
  }

  clearAll() {
    this.watchlistService.setClearProductIds(true);
  }

  public onChangeSearchTerm(e: any) {
    this.filterService.setSearch(e.target.value);
  }

  public onChangeSortBy(sortBy: string) {
    this.filterService.setSortBy(sortBy);
  }
}
