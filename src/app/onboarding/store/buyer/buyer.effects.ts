import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, filter, tap, take } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { omit } from 'lodash';

import { CsvExporterService } from '@services/csv-exporter/csv-exporter.service';
import { ApiService } from '@services/api/api.service';
import * as fromBuyer from './buyer.actions';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SnackbarService } from '@services/snackbar/snackbar.service';
import { BuyerOnboardingModalComponent } from '../../buyer-onboarding-modal/buyer-onboarding-modal.component';
import { BuyerInvoices, BuyerEntity, BuyerGroup, BuyerSanctions, BuyerDummy, BuyerInvite, BuyerSaml } from './buyer.model';
import { Store } from '@ngrx/store';
import { State } from 'src/app/admin/store';
import { Customer } from 'src/app/admin/store/customer/customer.model';
import {PopUpService} from '../../../shared/pop-up-service';

@Injectable()
export class BuyerEffects {

  startBuyerOnboarding$ = createEffect(() => this.actions$
    .pipe(ofType(fromBuyer.startBuyerOnboarding))
    .pipe(map(({ buyer, step }) => ({ data: { buyer, step }, width: '80vw', height: '80vh', disableClose: true } as MatDialogConfig)))
    .pipe(switchMap(config => this.dialog.open(BuyerOnboardingModalComponent, config).afterClosed())), { dispatch: false });

  editBuyer$ = createEffect(() => this.actions$
    .pipe(ofType(fromBuyer.editBuyer))
    .pipe(switchMap(({ id }) => this.apiService.adminGetBuyer(id)))
    .pipe(switchMap((buyer) => {
      this.dialog.open(BuyerOnboardingModalComponent, { data: { buyer, isEditBuyer: true }, width: '80vw', height: '80vh', disableClose: true } as MatDialogConfig).afterClosed().subscribe(() => {
        setTimeout(() => {
          this.popUpService.attachData({success: true, items: []});
        }, 400)
      });
      return of(buyer);
    }))
    .pipe(map(customer => {
      if (customer) {
        return fromBuyer.setCustomerOnboarding({ customer });
      }
    }
    )));


  createBuyerOnboarding$ = createEffect(() => this.actions$
    .pipe(ofType(fromBuyer.createBuyerOnboarding))
    .pipe(switchMap(({ entity }) => this.apiService.adminCreateBuyerOnboarding(omit(entity, '_id') as BuyerEntity)
      .pipe(map(buyer => {
        return fromBuyer.createBuyerOnboardingSuccess({ buyer, step: 'entity' });
      }))
      .pipe(catchError(error => of(fromBuyer.createBuyerOnboardingError({ error }))))
    )));

  updateBuyerEntity$ = createEffect(() => this.actions$
    .pipe(ofType(fromBuyer.patchBuyerOnboarding))
    .pipe(filter(({ step, buyer }) => step === 'entity' && !!buyer._id))
    .pipe(switchMap(({ buyer, id, step }) => this.apiService.adminUpdateBuyerEntity(id, buyer as BuyerEntity)
      .pipe(map(res => fromBuyer.patchBuyerOnboardingSuccess({ id, buyer: res, step })))
      .pipe(catchError(error => (
        this.store$.dispatch(fromBuyer.patchBuyerOnboardingError({ error })),
        this.snackbar.flash(`Error - ${error.error?.message}`),
        throwError(error)
      )))
    )));

  createBuyerInvoices$ = createEffect(() => this.actions$
    .pipe(ofType(fromBuyer.patchBuyerOnboarding))
    .pipe(filter(({ step, buyer }) => step === 'invoices' && !buyer._id))
    .pipe(switchMap(({ buyer, id, step }) => this.apiService.adminCreateBuyerInvoices(id, omit(buyer, '_id') as BuyerInvoices)
      .pipe(map(res => fromBuyer.patchBuyerOnboardingSuccess({ id, buyer: res, step })))
      .pipe(catchError(error => (
        this.store$.dispatch(fromBuyer.patchBuyerOnboardingError({ error })),
        this.snackbar.flash(`Error - ${error.error?.message}`),
        throwError(error)
      )))
    )));

  updateBuyerInvoices$ = createEffect(() => this.actions$
    .pipe(ofType(fromBuyer.patchBuyerOnboarding))
    .pipe(filter(({ step, buyer }) => step === 'invoices' && !!buyer._id))
    .pipe(switchMap(({ buyer, id, step }) => this.apiService.adminUpdateBuyerInvoices(id, buyer as BuyerInvoices)
      .pipe(map(res => fromBuyer.patchBuyerOnboardingSuccess({ id, buyer: res, step })))
      .pipe(catchError(error => (
        this.store$.dispatch(fromBuyer.patchBuyerOnboardingError({ error })),
        this.snackbar.flash(`Error - ${error.error?.message}`),
        throwError(error)
      )))
    )));

  createBuyerGroup$ = createEffect(() => this.actions$
    .pipe(ofType(fromBuyer.patchBuyerOnboarding))
    .pipe(filter(({ step, buyer }) => step === 'group' && !buyer._id))
    .pipe(switchMap(({ buyer, id, step }) => this.apiService.adminCreateBuyerGroup(id, omit(buyer, ['_id', 'new']) as BuyerGroup)
      .pipe(map(res => fromBuyer.patchBuyerOnboardingSuccess({ id, buyer: res, step })))
      .pipe(catchError(error => (
        this.store$.dispatch(fromBuyer.patchBuyerOnboardingError({ error })),
        this.snackbar.flash(`Error - ${error.error?.message}`),
        throwError(error)
      )))
    )));

  updateBuyerGroup$ = createEffect(() => this.actions$
    .pipe(ofType(fromBuyer.patchBuyerOnboarding))
    .pipe(filter(({ step, buyer }) => step === 'group' && !!buyer._id))
    .pipe(switchMap(({ buyer, id, step }) => this.apiService.adminUpdateBuyerGroup(id, omit(buyer, 'new') as BuyerGroup)
      .pipe(map(res => fromBuyer.patchBuyerOnboardingSuccess({ id, buyer: res, step })))
      .pipe(catchError(error => (
        this.store$.dispatch(fromBuyer.patchBuyerOnboardingError({ error })),
        this.snackbar.flash(`Error - ${error.error?.message}`),
        throwError(error)
      )))
    )));

  createBuyerSanctions$ = createEffect(() => this.actions$
    .pipe(ofType(fromBuyer.patchBuyerOnboarding))
    .pipe(filter(({ step, buyer }) => step === 'sanctions' && !buyer._id))
    .pipe(switchMap(({ buyer, id, step }) => this.apiService.adminCreateBuyerSanctions(id, omit(buyer, '_id') as BuyerSanctions)
      .pipe(map(res => fromBuyer.patchBuyerOnboardingSuccess({ id, buyer: res, step })))
      .pipe(catchError(error => (
        this.store$.dispatch(fromBuyer.patchBuyerOnboardingError({ error })),
        this.snackbar.flash(`Error - ${error.error?.message}`),
        throwError(error)
      )))
    )));

  updateBuyerSanctions$ = createEffect(() => this.actions$
    .pipe(ofType(fromBuyer.patchBuyerOnboarding))
    .pipe(filter(({ step, buyer }) => step === 'sanctions' && !!buyer._id))
    .pipe(switchMap(({ buyer, id, step }) => this.apiService.adminUpdateBuyerSanctions(id, buyer as BuyerSanctions)
      .pipe(map(res => fromBuyer.patchBuyerOnboardingSuccess({ id, buyer: res, step })))
      .pipe(catchError(error => (
        this.store$.dispatch(fromBuyer.patchBuyerOnboardingError({ error })),
        this.snackbar.flash(`Error - ${error.error?.message}`),
        throwError(error)
      )))
    )));

  createBuyerSaml$ = createEffect(() => this.actions$
    .pipe(ofType(fromBuyer.patchBuyerOnboarding))
    .pipe(filter(({ step, buyer }) => step === 'saml' && !buyer._id))
    .pipe(tap(({ buyer, id, step }) => console.log('createBuyerSaml', buyer, id, step)))
    .pipe(switchMap(({ buyer, id, step }) => this.apiService.adminCreateBuyerSaml(id, omit(buyer, '_id') as BuyerSaml) // TODO: uncomment this when we have the necessary http
      .pipe(map(res =>
        {
          return fromBuyer.patchBuyerOnboardingSuccess({ id, buyer: res, step })
        }
      ))
      .pipe(catchError(error => (
        this.store$.dispatch(fromBuyer.patchBuyerOnboardingError({ error })),
        // this.snackbar.flash(`Error - ${error.error?.message}`),
        throwError(error)
      )))
    ))
  );

  updateBuyerSaml$ = createEffect(() => this.actions$
    .pipe(ofType(fromBuyer.patchBuyerOnboarding))
    .pipe(filter(({ step, buyer }) => step === 'saml' && !!buyer._id))
    .pipe(tap(({ buyer, id, step }) => console.log('updateBuyerSaml', buyer, id, step)))
    .pipe(switchMap(({ buyer, id, step }) => this.apiService.adminUpdateBuyerSaml(id, omit(buyer, '_id') as BuyerSaml)
      .pipe(map(res => fromBuyer.patchBuyerOnboardingSuccess({ id, buyer: res, step })))
      .pipe(catchError(error => (
        this.store$.dispatch(fromBuyer.patchBuyerOnboardingError({ error })),
        // this.snackbar.flash(`Error - ${error.error?.message}`),
        throwError(error)
      )))
    ))
  );

  createBuyerInvite$ = createEffect(() => this.actions$
    .pipe(ofType(fromBuyer.patchBuyerOnboarding))
    .pipe(filter(({ step, buyer }) => step === 'invite' && !buyer._id))
    .pipe(switchMap(({ buyer, id, step }) => {
      return this.apiService.adminCreateBuyerInvite(id, omit(buyer, '_id') as BuyerInvite)
        .pipe(map(res => fromBuyer.patchBuyerOnboardingSuccess({ id, buyer: res, step })))
        .pipe(catchError(error => (
          this.store$.dispatch(fromBuyer.patchBuyerOnboardingError({ error })),
          this.snackbar.flash(`Error - ${error.error?.message}`),
          throwError(error)
        )));
    }
    )));

  updateBuyerInvite$ = createEffect(() => this.actions$
    .pipe(ofType(fromBuyer.patchBuyerOnboarding))
    .pipe(filter(({ step, buyer }) => step === 'invite' && !!buyer._id))
    .pipe(switchMap(({ buyer, id, step }) => this.apiService.adminUpdateBuyerInvite(id, buyer as BuyerInvite)
      .pipe(map(res => fromBuyer.patchBuyerOnboardingSuccess({ id, buyer: res, step })))
      .pipe(catchError(error => (
        this.store$.dispatch(fromBuyer.patchBuyerOnboardingError({ error })),
        this.snackbar.flash(`Error - ${error.error?.message}`),
        throwError(error)
      )))
    )));

  createBuyerDummy$ = createEffect(() => this.actions$
    .pipe(ofType(fromBuyer.patchBuyerOnboarding))
    .pipe(filter(({ step, buyer }) => step === 'dummy' && !buyer._id))
    .pipe(switchMap(({ buyer, id, step }) => this.apiService.adminCreateBuyerDummy(id, omit(buyer, '_id') as BuyerDummy)
      .pipe(map(res => fromBuyer.patchBuyerOnboardingSuccess({ id, buyer: res, step })))
      .pipe(catchError(error => (
        this.store$.dispatch(fromBuyer.patchBuyerOnboardingError({ error })),
        this.snackbar.flash(`Error - ${error.error?.message}`),
        throwError(error)
      )))
    )));

  updateBuyerDummy$ = createEffect(() => this.actions$
    .pipe(ofType(fromBuyer.patchBuyerOnboarding))
    .pipe(filter(({ step, buyer }) => step === 'dummy' && !!buyer._id))
    .pipe(switchMap(({ buyer, id, step }) => this.apiService.adminUpdateBuyerDummy(id, buyer as BuyerDummy)
      .pipe(map(res => fromBuyer.patchBuyerOnboardingSuccess({ id, buyer: res, step })))
      .pipe(catchError(error => (
        this.store$.dispatch(fromBuyer.patchBuyerOnboardingError({ error })),
        this.snackbar.flash(`Error - ${error.error?.message}`),
        throwError(error)
      )))
    )));

  createBuyerCompanyOnboarding$ = createEffect(() => this.actions$
    .pipe(ofType(fromBuyer.createBuyerCompanyOnboarding))
    .pipe(switchMap(({ buyerId, entity }) => this.apiService.adminCreateCompanyEntity(buyerId, omit(entity, '_id') as BuyerEntity)
      .pipe(map(buyer => fromBuyer.createBuyerCompanyOnboardingSuccess({ buyerId, buyer })))
      .pipe(catchError(error => of(fromBuyer.createBuyerCompanyOnboardingError({ error }))))
    )));

  updateBuyerCompanyEntity$ = createEffect(() => this.actions$
    .pipe(ofType(fromBuyer.patchBuyerCompanyOnboarding))
    .pipe(filter(({ step, buyer }) => step === 'entity' && !!buyer._id))
    .pipe(switchMap(({ buyerId, buyer, id, step }) => this.apiService.adminUpdateCompanyEntity(buyerId, buyer as BuyerEntity)
      .pipe(map(res => fromBuyer.patchBuyerCompanyOnboardingSuccess({ buyerId, id, buyer: res, step })))
      .pipe(catchError(error => (
        this.store$.dispatch(fromBuyer.patchBuyerCompanyOnboardingError({ error })),
        this.snackbar.flash(`Error - ${error.error?.message}`),
        throwError(error)
      )))
    )));

  createBuyerCompanyInvoices$ = createEffect(() => this.actions$
    .pipe(ofType(fromBuyer.patchBuyerCompanyOnboarding))
    .pipe(filter(({ step, buyer }) => step === 'invoices' && !buyer._id))
    .pipe(switchMap(({ buyerId, buyer, id, step }) => this.apiService.adminCreateCompanyInvoices(buyerId, omit(buyer, '_id') as BuyerInvoices)
      .pipe(map(res => fromBuyer.patchBuyerCompanyOnboardingSuccess({ buyerId, id, buyer: res, step })))
      .pipe(catchError(error => (
        this.store$.dispatch(fromBuyer.patchBuyerCompanyOnboardingError({ error })),
        this.snackbar.flash(`Error - ${error.error?.message}`),
        throwError(error)
      )))
    )));

  updateBuyerCompanyInvoices$ = createEffect(() => this.actions$
    .pipe(ofType(fromBuyer.patchBuyerCompanyOnboarding))
    .pipe(filter(({ step, buyer }) => step === 'invoices' && !!buyer._id))
    .pipe(switchMap(({ buyerId, buyer, id, step }) => this.apiService.adminUpdateCompanyInvoices(buyerId, buyer as BuyerInvoices)
      .pipe(map(res => fromBuyer.patchBuyerCompanyOnboardingSuccess({ buyerId, id, buyer: res, step })))
      .pipe(catchError(error => (
        this.store$.dispatch(fromBuyer.patchBuyerCompanyOnboardingError({ error })),
        this.snackbar.flash(`Error - ${error.error?.message}`),
        throwError(error)
      )))
    )));

  uploadContractTemplateBuyer$ = createEffect(() => this.actions$
    .pipe(ofType(fromBuyer.uploadContractTemplateBuyer))
    .pipe(switchMap(({ buyerId, contractType, file }) => this.apiService.adminUploadContractTemplete(buyerId, contractType, file)
      .pipe(map(res => fromBuyer.uploadContractTemplateCompleted(res)))
      .pipe(catchError(error => (
        this.store$.dispatch(fromBuyer.patchBuyerCompanyOnboardingError({ error })),
        this.snackbar.flash(`Error - ${error.error?.message}`),
        throwError(error)
      )))
    )));

  constructor(
    private actions$: Actions,
    private store$: Store<State>,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
    private csvExporter: CsvExporterService,
    private popUpService: PopUpService,
    private apiService: ApiService) { }
}
