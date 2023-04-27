import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { State } from 'src/app/admin/store';
import { SupplierReview } from 'src/app/admin/store/supplier/supplier.model';
import { selectProductSupplier } from 'src/app/admin/store/product/product.selector';

@Component({
  templateUrl: './product-supplier-page.component.html',
  styleUrls: ['./product-supplier-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductSupplierPageComponent implements OnInit {

  supplierReview$: Observable<SupplierReview>;

  constructor(private store: Store<State>) { }

  ngOnInit() {
    this.supplierReview$ = this.store.select(selectProductSupplier);
  }

}
