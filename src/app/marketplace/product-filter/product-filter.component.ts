import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterService } from '@shared/filter-service';
import { TFilterDetail } from '@shared/types/TFilterDetail';

@Component({
  selector: 'product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent implements OnInit {

  @Output() openFilter = new EventEmitter();
  @Output() tabChange = new EventEmitter();
  @Input() tab: string;

  filters: { name: string, value: string, title: string }[] = [];
  totalCount = 0;
  filterDetail: TFilterDetail;
  isAllSelected = false;
  selectedCount = 0;
  pagination: any = {};
  sortByLabel = '';

  constructor(
    private filterService: FilterService,
  ) { }

  ngOnInit(): void {
    this.filterService.filterOverview.subscribe((res) => {
      this.filterDetail = res;
      if (this.filterDetail.sortBy === 'topRated') {
        this.sortByLabel = 'Top Rated';
      } else if (this.filterDetail.sortBy === 'newest') {
        this.sortByLabel = 'Newest';
      } else if (this.filterDetail.sortBy === 'oldest') {
        this.sortByLabel = 'Oldest';
      } else if (this.filterDetail.sortBy === 'alphabetic') {
        this.sortByLabel = 'A - Z';
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
    this.filterService.filterResCounterOverview.subscribe((res) => {
      this.totalCount = res;
    });
    this.filterService.filterSelectAllOverview.subscribe((res) => {
      this.isAllSelected = res;
    });
    this.filterService.paginationOverview.subscribe((res) => {
      this.pagination = res;
    });
    this.filterService.selectedDataOverview.subscribe((res) => {
      this.selectedCount = res.selected.length;
    });
  }

  onOpenFilter() {
    this.openFilter.emit({} as any);
  }

  onChangeTab(name) {
    this.tabChange.emit(name);
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
    this.filterService.setSelectAll();
  }

  clearAll() {
    this.filterService.clearSelectedData();
  }

  public onChangeSearchTerm(e: any) {
    this.filterService.setSearch(e.target.value);
  }

  public onChangeSortBy(sortBy: string) {
    this.filterService.setSortBy(sortBy);
  }
}
