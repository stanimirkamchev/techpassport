import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../common/services/api/api.service';
import { SupplierModel } from '../supplier-list/supplier-list.component';

@Component({
  selector: 'new-supplier-list',
  templateUrl: './new-supplier-list.component.html',
  styleUrls: ['./new-supplier-list.component.scss']
})

export class NewSupplierListComponent implements OnInit {
  loading = false;
  dataSource = new MatTableDataSource<SupplierModel>();
  selection = new SelectionModel<any>(true, []);
  displayedColumns = [
    'icon',
    'name',
    'details',
    'fundingRound',
    'website',
    'NDA',
    'rapidPOC',
    'trialfee',
    'pidata',
    'action'
  ];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getNewSuppliers();
  }

  getNewSuppliers() {
    this.loading = true;
    this.apiService.getNewSuppliers().subscribe(res => {
      this.dataSource.data = res.body.map(item => ({
        _id: item._id,
        name: item.name,
        location: item.city,
        dateEstablished: 'n/a',
        fundingRound: 'n/a',
        products: 3,
        website: 'n/a',
        NDA: item.rapidNDA,
        rapidPOC: true,
      }));
      this.loading = false;
    });
  }

  openDetails(elem: any) {
    console.log(elem);
  }

  checkboxLabel(row?: any): string {
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.orgId + 1}`;
  }

  checkedItems(el, row) {
  }
}
