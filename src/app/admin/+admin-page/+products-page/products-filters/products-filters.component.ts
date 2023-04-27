import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { get } from 'lodash';

import { Product, ProductsFilters, ProductStatus, ProductReviewer } from 'src/app/admin/store/product/product.model';
import { filterDebounce } from '@models/filters';

@Component({
  selector: 'products-filters',
  templateUrl: './products-filters.component.html',
  styleUrls: ['./products-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsFiltersComponent implements OnInit, OnDestroy {

  @Input() set filters(filters: ProductsFilters) {
    this.formGroup.patchValue(filters, { emitEvent: false });
  }
  @Input() set products(products: Product[]) {
    this.tags = [...new Set(products.reduce((acc, curr) => acc.concat(curr.tags), []))];
    this.admins = [...new Set(products.map(({ review: r }) => r && r.reviewer && r.reviewer._id).filter(i => !!i))]
      .map(id => get(products.find(p => p.review.reviewer._id === id), 'review.reviewer'));
    this.productStatuses = [...new Set(products.map(({ status }) => status))];
  }
  @Input() set sort(sort: Sort) {
    this.formGroup.get('sort').setValue(sort, { onlySelf: true });
  }
  @Output() filter = new EventEmitter<ProductsFilters>();

  ProductStatus = ProductStatus;
  productStatuses: ProductStatus[];
  admins: ProductReviewer[];
  tags: string[];

  formGroup = new FormGroup({
    status: new FormControl(''),
    tag: new FormControl(''),
    reviewer: new FormControl(''),
    sort: new FormControl(''),
    search: new FormControl('')
  });

  private destroyed$ = new Subject();

  constructor() { }

  ngOnInit() {
    this.formGroup.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .pipe(debounceTime(filterDebounce))
      .subscribe(filters => this.filter.emit(filters));
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
