import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductReview, ProductDetails, Product } from 'src/app/admin/store/product/product.model';
import { Store } from '@ngrx/store';
import { State } from 'src/app/admin/store';
import { selectProductReview, selectProductDetails } from 'src/app/admin/store/product/product.selector';
import { showRejectionDetails } from 'src/app/admin/store/product/product.actions';

@Component({
  templateUrl: './product-review-page.component.html',
  styleUrls: ['./product-review-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductReviewPageComponent implements OnInit {

  productDetails$: Observable<ProductDetails>;

  constructor(private store: Store<State>) { }

  ngOnInit() {
    this.productDetails$ = this.store.select(selectProductDetails);
  }

  showRejectionDetails(product: Product) {
    this.store.dispatch(showRejectionDetails({ product }));
  }
}
