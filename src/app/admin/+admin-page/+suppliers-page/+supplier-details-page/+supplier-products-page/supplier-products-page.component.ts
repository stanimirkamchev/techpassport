import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { Product } from 'src/app/admin/store/product/product.model';
import { State } from 'src/app/admin/store';
import { selectSupplierProducts } from 'src/app/admin/store/supplier/supplier.selector';

@Component({
  templateUrl: './supplier-products-page.component.html',
  styleUrls: ['./supplier-products-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupplierProductsPageComponent implements OnInit {

  supplierProducts$: Observable<Product[]>;

  constructor(
    private store: Store<State>,
    private router: Router) { }

  ngOnInit() {
    this.supplierProducts$ = this.store.select(selectSupplierProducts);
  }

  openProduct(product: Product) {
    this.router.navigate([`/admin/products/${product._id}`]);
  }
}
