import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '@services/api/api.service';
import { FilterService } from '@shared/filter-service';
import { debounceTime } from 'rxjs/operators';
import { filterDebounce } from '@models/filters';
import { TFilterDetail } from '@shared/types/TFilterDetail';

export interface SupplierModel {
  _id: string;
  id: string;
  name: string;
  location: string;
  dateEstablished: Date;
  fundingRound: string;
  products?: number;
  website: string;
  NDA: boolean;
  rapidPOC: boolean;
}
@Component({
  selector: 'supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss']
})
export class SupplierListComponent implements OnInit {
  loading = false;
  dataSource = new MatTableDataSource<SupplierModel>();
  selection = new SelectionModel<any>(true, []);
  displayedColumns = [
    'name',
    'location',
    'dateEstablished',
    'fundingRound',
    'website',
    'action'
  ];
  filterDetail: TFilterDetail;
  hasFilter = false;
  inviting = false;

  constructor(
    private apiService: ApiService,
    private filterService: FilterService
  ) { }

  ngOnInit(): void {
    this.filterService.filterOverview
      .pipe(debounceTime(filterDebounce))
      .subscribe((res) => {
        this.filterDetail = res;
        this.hasFilter = !!Object.keys(this.filterDetail.outputFilteredData)?.length || !!this.filterDetail.search;
        if (this.hasFilter) {
          this.searchSuppliers();
        } else {
          this.dataSource = new MatTableDataSource<SupplierModel>([]);
        }
      });
  }

  searchSuppliers() {
    if (!this.hasFilter) { return; }
    this.loading = true;
    const filters = this.filterDetail?.resultFilteredData || {};

    this.apiService.searchSuppliers({
      ...filters,
      search: this.filterDetail?.search,
    }).subscribe((res) => {
      const data = res.body.map((item) => ({
        _id: item._id,
        id: item.id,
        name: item.name,
        location: item.country,
        dateEstablished: item.createdAt,
        fundingRound: item.companyStage,
        // products: item.products?.length || 0,
        website: item.companyWebsite,
      }));
      this.dataSource = new MatTableDataSource<SupplierModel>(data);
      this.loading = false;
      this.selection = new SelectionModel<any>(true, []);
    });
  }

  changePage(event) {
  }

  checkboxLabel(row?: any): string {
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.orgId + 1}`;
  }

  checkedItems(el, row) {
  }

  selectAll() {
    const selectedSuppliers = this.selection.selected;
    this.dataSource.data.forEach((supplier) => {
      const exist = selectedSuppliers.find((item) => item._id === supplier._id);
      if (exist) {
        this.selection.deselect(exist);
      }
    });
    this.selection.select(...this.dataSource.data);
  }
  inviteSupplier() {
    if (this.selection.isEmpty()) { return; }

    const ids = this.selection.selected.map((item) => item.id);
    this.inviting = true;
    this.apiService.inviteSuppliers(ids).subscribe((res) => {
      this.inviting = false;
      this.selection.clear();
    });
  }

  openLink(url: string) {
    window.open('//' + url, '_blank');
  }
}
