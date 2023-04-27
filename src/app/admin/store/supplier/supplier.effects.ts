import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, filter, tap } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';

import * as fromSupplier from './supplier.actions';
import { ApiService } from '@services/api/api.service';
import { RejectionModalComponent } from '../../rejection-modal/rejection-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from '@services/snackbar/snackbar.service';
import { ApprovalModalComponent } from '../../approval-modal/approval-modal.component';
import { Supplier } from './supplier.model';
import { CsvExporterService } from '@services/csv-exporter/csv-exporter.service';
import { EventEmitterService } from '@services/event-emitter/event-emitter.service';

@Injectable()
export class SupplierEffects {

  loadSuppliers$ = createEffect(() => this.actions$
    .pipe(ofType(fromSupplier.loadSuppliers))
    .pipe(switchMap(() => this.apiService.adminGetSuppliers()
      .pipe(map(suppliers => fromSupplier.loadSuppliersSuccess({ suppliers })))
      .pipe(catchError(error => of(fromSupplier.loadSuppliersError({ error }))))
    )));

  loadSupplierDetails$ = createEffect(() => this.actions$
    .pipe(ofType(fromSupplier.loadSupplierDetails))
    .pipe(switchMap(({ id }) => forkJoin([
        this.apiService.adminGetSupplierItem(id),
        this.apiService.adminGetSupplierReview(id),
        this.apiService.adminGetSupplierProducts(id),
        this.apiService.adminGetComplianceInformationSecurity(id),
        this.apiService.adminGetComplianceChecklist(id)
      ])
      .pipe(map(([supplier, review, products, informationSecurity, assessment]) =>
        ({ supplier, review, products, informationSecurity, assessment })))
      .pipe(map(supplierDetails => fromSupplier.loadSupplierDetailsSuccess({ supplierDetails })))
      .pipe(catchError(error => of(fromSupplier.loadSupplierDetailsError({ error }))))
    )));

  rejectSupplier$ = createEffect((): any => this.actions$
    .pipe(ofType(fromSupplier.rejectSupplier))
    .pipe(switchMap(({ supplier }) => this.dialog.open(RejectionModalComponent).afterClosed()
      .pipe(filter(d => !!d))
      .pipe(switchMap(data => this.apiService.adminRejectSupplier(supplier._id, data)))
      .pipe(tap(() => this.snackbar.flash('Supplier has been rejected')))
      .pipe(map(_ => fromSupplier.rejectSupplierSuccess({ supplier })))
      .pipe(catchError(error => of(fromSupplier.rejectSupplierError({ error }))))
    )));

  approveSupplier$ = createEffect(() => this.actions$
    .pipe(ofType(fromSupplier.approveSupplier))
    .pipe(switchMap(({ supplier }) => this.dialog.open(ApprovalModalComponent).afterClosed()
      .pipe(filter(d => !!d))
      .pipe(switchMap(data => this.apiService.adminApproveSupplier(supplier._id, data)))
      .pipe(tap(() => this.snackbar.flash('Supplier has been approved')))
      .pipe(map(_ => fromSupplier.approveSupplierSuccess({ supplier })))
      .pipe(catchError(error => of(fromSupplier.approveSupplierError({ error }))))
    )));

  showRejectionDetails$ = createEffect(() => this.actions$
    .pipe(ofType(fromSupplier.showRejectionDetails))
    .pipe(map(({ supplier }) => ({ review: supplier.review, readonly: true })))
    .pipe(switchMap(data => this.dialog.open(RejectionModalComponent, { data }).afterClosed())),
    { dispatch: false });

  addSupplierProduct$ = createEffect(() => this.actions$
    .pipe(ofType(fromSupplier.addSupplierProduct))
    .pipe(tap(({ supplier }) => this.eventEmitter.onProductOnboad(null, supplier._id))),
    { dispatch: false });

  editSupplierCompliance$ = createEffect(() => this.actions$
    .pipe(ofType(fromSupplier.editSupplierCompliance))
    .pipe(tap(({ supplier }) => this.eventEmitter.onAssesment({supplier, onBehalf: true, jumpToCategory: 0}, null, false))),
    { dispatch: false });

  downloadSuppliers$ = createEffect(() => this.actions$
    .pipe(ofType(fromSupplier.downloadSuppliers))
    .pipe(tap(({ suppliers }) =>
    {
      const sanitize = (desc: string) => {
        if (desc) {
          desc = desc.replace(/,/g, '\,');
          desc = desc.replace(/"/g, '""');
        } else {
          desc = '';
        }
        return desc;
      };

      return this.csvExporter.export<Supplier>(suppliers, [
        ['Onboarding Status', 'onboardingStatus'],
        ['Date of Last Change', 'updatedAt'],
        ['Supplier Name', (s) => s.name ? `"${sanitize(s.name)}"` : 'n/a'],
        ['Signup User', (s: Supplier) => s.owner && s.owner.displayName ? `"${sanitize(s.owner.displayName)}"` : 'n/a'],
        ['Phone', 'phone'],
        ['Date of Signup', 'createdAt'],
        ['Numbers of Users for Supplier', 'numberOfUsers'],
        ['Membership', 'members'],
        ['Opt-in / Opt-out', 'optIn'],
        ['Number of Products approved by TP', 'numberOfProductsApproved'],
        ['Number of Products pending approval', 'numberOfProducts'],
        ['Status', 'status'],
        ['Admin Reviewer', (s: Supplier) => s.review && s.review.displayName],
      ], 'TechPassport Suppliers export')

    })),
    { dispatch: false });

  constructor(
    private actions$: Actions,
    private dialog: MatDialog,
    private csvExporter: CsvExporterService,
    private eventEmitter: EventEmitterService,
    private snackbar: SnackbarService,
    private apiService: ApiService) {}
}
