import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap, filter, take, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { State } from '../../store';
import { Product, ProductsFilters } from '../../store/product/product.model';
import { selectProductLoaded, selectProducts, selectCachedProducts,
  selectProductsLoading, selectProductsFilters } from '../../store/product/product.selector';
import { loadProducts, sortProducts, filterProducts, downloadProducts } from '../../store/product/product.actions';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsPageComponent implements OnInit {

  products$: Observable<Product[]>;
  filters$: Observable<ProductsFilters>;
  loading$: Observable<boolean>;
  cachedProducts$: Observable<Product[]>;

  constructor(
    private store: Store<State>,
    private router: Router) { }

  ngOnInit() {
    this.cachedProducts$ = this.store.select(selectCachedProducts);
    this.filters$ = this.store.select(selectProductsFilters);
    this.loading$ = this.store.select(selectProductsLoading);
    this.products$ = this.store.select(selectProductLoaded)
      .pipe(take(1), tap(loaded => !loaded && this.store.dispatch(loadProducts())))
      .pipe(filter(loaded => !!loaded))
      .pipe(switchMap(_ => this.store.select(selectProducts)));
  }

  openProduct(product: Product) {
    this.router.navigate([`/admin/products/${product._id}`]);
  }

  onSort(sort: Sort) {
    this.store.dispatch(sortProducts({ sort }));
  }

  onFilter(filters: ProductsFilters) {
    this.store.dispatch(filterProducts({ filters }));
  }

  download(products: Product[]) {
    this.store.dispatch(downloadProducts({ products }));
  }
}
