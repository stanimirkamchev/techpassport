import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';

import { Product, ProductStatus } from 'src/app/admin/store/product/product.model';
import { Selectable } from '@abstract/selectable';

@Component({
  selector: 'products-table',
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsTableComponent extends Selectable<Product> {

  @Input() products: Product[];
  @Output() sort = new EventEmitter<Sort>();
  @Output() openProduct = new EventEmitter<Product>();

  ProductStatus = ProductStatus;

  displayedColumns = ['name', 'description', 'tags', 'createdAt', 'supplier.name',
    'status', 'review.comment', 'review.reviewer.displayName', 'review.date'];

  constructor(protected elementRef: ElementRef) {
    super(elementRef);
  }
}
