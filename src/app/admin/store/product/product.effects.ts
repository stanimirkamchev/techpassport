import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, withLatestFrom, tap, filter } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';
import { get } from 'lodash';

import * as fromProduct from './product.actions';
import { ApiService } from '@services/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RejectionModalComponent } from '../../rejection-modal/rejection-modal.component';
import { ApprovalModalComponent } from '../../approval-modal/approval-modal.component';
import { SnackbarService } from '@services/snackbar/snackbar.service';
import { CsvExporterService } from '@services/csv-exporter/csv-exporter.service';
import { Product } from './product.model';
import { EventEmitterService } from '@services/event-emitter/event-emitter.service';

@Injectable()
export class ProductEffects {

  loadProducts$ = createEffect(() => this.actions$
    .pipe(ofType(fromProduct.loadProducts))
    .pipe(switchMap(() => this.apiService.adminGetProducts()
      .pipe(map(products => fromProduct.loadProductsSuccess({ products })))
      .pipe(catchError(error => of(fromProduct.loadProductsError({ error }))))
    )));

  loadProductDetails$ = createEffect(() => this.actions$
    .pipe(ofType(fromProduct.loadProductDetails))
    .pipe(switchMap(({ id }) => this.apiService.adminGetProductItem(id)
      .pipe(switchMap(product => forkJoin([
        of(product),
        this.apiService.adminGetProductReview(product._id),
        this.apiService.adminGetSupplierReview(product.supplier._id),
        this.apiService.adminGetComplianceInformationSecurity(product.supplier._id),
        this.apiService.adminGetComplianceChecklist(product.supplier._id)
      ])))
      .pipe(map(([product, review, supplier, informationSecurity, assessment]) =>
        ({ product, supplier, review, informationSecurity, assessment })))
      .pipe(map(productDetails => fromProduct.loadProductDetailsSuccess({ productDetails })))
      .pipe(catchError(error => of(fromProduct.loadProductDetailsError({ error }))))
    )));

  rejectProduct$ = createEffect(() => this.actions$
    .pipe(ofType(fromProduct.rejectProduct))
    .pipe(switchMap(({ product }) => this.dialog.open(RejectionModalComponent).afterClosed()
      .pipe(filter(d => !!d))
      .pipe(switchMap(data => this.apiService.adminRejectProduct(product._id, data)))
      .pipe(tap(() => this.snackbar.flash('Product has been rejected')))
      .pipe(map(_ => fromProduct.rejectProductSuccess({ product })))
      .pipe(catchError(error => of(fromProduct.rejectProductError({ error }))))
    )));

  approveProduct$ = createEffect(() => this.actions$
    .pipe(ofType(fromProduct.approveProduct))
    .pipe(switchMap(({ product }) => this.dialog.open(ApprovalModalComponent).afterClosed()
      .pipe(filter(d => !!d))
      .pipe(switchMap(data => this.apiService.adminApproveProduct(product._id, data)))
      .pipe(tap(() => this.snackbar.flash('Product has been approved')))
      .pipe(map(_ => fromProduct.approveProductSuccess({ product })))
      .pipe(catchError(error => of(fromProduct.approveProductError({ error }))))
    )));

  showRejectionDetails$ = createEffect(() => this.actions$
    .pipe(ofType(fromProduct.showRejectionDetails))
    .pipe(map(({ product }) => ({ review: product.review, readonly: true })))
    .pipe(switchMap(data => this.dialog.open(RejectionModalComponent, { data }).afterClosed())),
    { dispatch: false });

  downloadProducts$ = createEffect(() => this.actions$
    .pipe(ofType(fromProduct.downloadProducts))
    .pipe(tap(({ products }) => {

      const sanitize = (desc: string) => {
        if (desc) {
          desc = desc.replace(/,/g, '\,');
          desc = desc.replace(/"/g, '""');
        } else {
          desc = '';
        }
        return desc;
      };

      return this.csvExporter.export<Product>(products, [
        ['Name', (p: any) => `"${p.name && p.name.length > 0 ? p.name.replace(/,/g, ' ') : ''}"`],
        ['Description', (p: any) => p.description && p.description.length > 0 ? p.description.replace(/[\r\n\,]/g, '\ ') : ''],
        ['Tags', (p: Product) => {
          let tags = p.tags.filter(i => i).length > 0 ? p.tags : null
          return tags && tags.length > 0 ? `"${sanitize(tags.join(' '))}"` : ''
        } ],
        ['Product Created Date', 'createdAt'],
        ['Company Name', (p: Product) => `"${sanitize(p.supplier.name)}"`],
        ['Product Status', (p: any) => `"${sanitize(p.status)}"`],
        ['Comments from TP', (p: Product) => p.review && p.review.comment && p.review.comment.length > 0 ? p.review.comment.replace(/[\r\n\,]/g, '\ ') : ''],
        ['TP Admin Owner', (p: Product) => `"${sanitize((get(p, 'review.reviewer.displayName')) as any )}"`],
        ['Date Stamp Change', (p: Product) => p.review && (p.review as any).date]
      ], 'TechPassport Products export')

  })),
    { dispatch: false });

  editProduct$ = createEffect(() => this.actions$
    .pipe(ofType(fromProduct.editProduct))
    .pipe(tap(({ product }) => this.eventEmitter.onProductOnboad(product))),
    { dispatch: false });

  constructor(
    private actions$: Actions,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
    private eventEmitter: EventEmitterService,
    private csvExporter: CsvExporterService,
    private apiService: ApiService) {}
}
