import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { SupplierReview, Supplier } from 'src/app/admin/store/supplier/supplier.model';

@Component({
  selector: 'supplier-assesment-table',
  templateUrl: './supplier-assesment-table.component.html',
  styleUrls: ['./supplier-assesment-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupplierAssesmentTableComponent implements OnInit {

  @Input() supplierReview: SupplierReview;

  constructor() { }

  ngOnInit() {
  }

}
