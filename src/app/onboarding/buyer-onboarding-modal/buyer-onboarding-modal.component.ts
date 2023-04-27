import { Component, ChangeDetectionStrategy, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { takeUntil, tap } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { pick } from 'lodash';

import { Buyer, BuyerEntity, buyerEntityProps } from '../store/buyer/buyer.model';
import { State } from '../store';
import { patchBuyerOnboarding, createBuyerOnboarding, unsetCustomerOnboarding } from '../store/buyer/buyer.actions';
import { selectBuyerValue } from '../store/buyer/buyer.selectors';
import { Destroyable } from '@abstract/destroyable';

@Component({
  templateUrl: './buyer-onboarding-modal.component.html',
  styleUrls: ['./buyer-onboarding-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuyerOnboardingModalComponent extends Destroyable implements OnInit {

  formGroup = new FormGroup({
    buyer: new FormControl(''),
    id: new FormControl('')
  });
  isSamlAuthenticated = false

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { buyer?: Buyer, isEditBuyer: boolean, step: number },
    private cdRef: ChangeDetectorRef,
    private dialogRef: MatDialogRef<BuyerOnboardingModalComponent>,
    private store: Store<State>) {
    super();
  }

  ngOnInit() {
    if (this.data && this.data.buyer) {
      console.log(this.data)
      this.formGroup.get('id').setValue(this.data.buyer._id);
      this.formGroup.get('buyer').setValue(this.data.buyer);
    }
    this.dialogRef.afterClosed().subscribe(_ => {
      this.store.dispatch(unsetCustomerOnboarding());
    });
    this.store.select(selectBuyerValue)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(({ _id: id, ...buyer }) => {
        this.formGroup.setValue({ id, buyer });
        this.cdRef.detectChanges();
      });
  }

  createBuyerOnboarding() {
    const id = this.formGroup.get('id').value;
    const { entity } = this.formGroup.get('buyer').value;
    if (!id) {
      this.store.dispatch(createBuyerOnboarding({ entity } as { entity: BuyerEntity }));
    }
    else {
      this.store.dispatch(patchBuyerOnboarding({ id, buyer: entity, step: 'entity' }));
    }
  }

  patchBuyerOnboarding(step: string) {
    const stepValue = this.formGroup.get('buyer').value[step];

    const { value: id } = this.formGroup.get('id');
    if (step === 'saml') {
      this.isSamlAuthenticated = stepValue.isSamlAuthenticated
    }
    if(step === 'invite') {
      stepValue.isSamlAuthenticated = this.isSamlAuthenticated
      stepValue.isEditBuyer = this.data.isEditBuyer
    }
    this.store.dispatch(patchBuyerOnboarding({ id, buyer: stepValue, step }));
  }

  finishBuyerOnboarding() {
    this.patchBuyerOnboarding('invite');
    this.dialogRef.close();
  }

  closeBuyerOnboarding() {
    this.dialogRef.close();
  }
}
