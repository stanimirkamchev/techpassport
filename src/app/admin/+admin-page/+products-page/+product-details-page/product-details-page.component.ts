import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';

import { ProductDetails, Product } from 'src/app/admin/store/product/product.model';
import { State } from 'src/app/admin/store';
import { loadProductDetails, downloadProduct, approveProduct, rejectProduct, editProduct } from 'src/app/admin/store/product/product.actions';
import { selectProductDetailsLoading, selectProductDetails } from 'src/app/admin/store/product/product.selector';

@Component({
  selector: 'app-product-details-page',
  templateUrl: './product-details-page.component.html',
  styleUrls: ['./product-details-page.component.scss']
})
export class ProductDetailsPageComponent implements OnInit {

  productDetails$: Observable<ProductDetails>;
  loading$: Observable<boolean>;

  constructor(
    private store: Store<State>,
    public router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.store.dispatch(loadProductDetails({ id: this.activatedRoute.snapshot.params.id }));
    this.loading$ = this.store.select(selectProductDetailsLoading);
    this.productDetails$ = this.store.select(selectProductDetails);
  }

  download(product: Product) {
    this.store.dispatch(downloadProduct({ product }));
  }

  approve(product: Product) {
    this.store.dispatch(approveProduct({ product }));
  }

  reject(product: Product) {
    this.store.dispatch(rejectProduct({ product }));
  }

  edit(product: Product) {
    this.store.dispatch(editProduct({ product }));
  }
}
