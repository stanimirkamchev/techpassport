import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Product } from 'src/app/admin/store/product/product.model';
import { State } from 'src/app/admin/store';
import { selectComplianceProducts } from 'src/app/admin/store/compliance/compliance.selector';

@Component({
  templateUrl: './compliance-product-page.component.html',
  styleUrls: ['./compliance-product-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComplianceProductPageComponent implements OnInit {

  products$: Observable<Product[]>;

  constructor(
    private store: Store<State>,
    private router: Router) { }

  ngOnInit() {
    this.products$ = this.store.select(selectComplianceProducts);
  }

  openProduct(product: Product) {
    this.router.navigate([`/admin/products/${product._id}`]);
  }

}
