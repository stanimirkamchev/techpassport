import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { ProductReview } from 'src/app/admin/store/product/product.model';

@Component({
  selector: 'product-assesment-table',
  templateUrl: './product-assesment-table.component.html',
  styleUrls: ['./product-assesment-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductAssesmentTableComponent implements OnInit {

  @Input() productReview: ProductReview;

  constructor() { }

  ngOnInit() {
  }

}
