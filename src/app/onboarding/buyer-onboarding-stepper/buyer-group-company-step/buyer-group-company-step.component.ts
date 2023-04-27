import { Component, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { OnboardingStepAbstract } from '../../onboarding.abstract';
import { Buyer, BuyerEntity } from '../../store/buyer/buyer.model';
import { Store } from '@ngrx/store';
import { State } from '../../store';
import { createBuyerCompanyOnboarding, patchBuyerCompanyOnboarding } from '../../store/buyer/buyer.actions';

@Component({
  selector: 'buyer-group-company-step',
  templateUrl: './buyer-group-company-step.component.html',
  styleUrls: ['./buyer-group-company-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => BuyerGroupCompanyStepComponent),
    multi: true
  }]
})
export class BuyerGroupCompanyStepComponent extends OnboardingStepAbstract<Buyer> {

  constructor(private store: Store<State>) {
    super();
  }
  cancelCompanyOnboarding() {
    this.formGroup.get('creatingNew').setValue(false);
  }
  finishCompanyOnboarding() {
    this.patchBuyerCompany('invoices');
    this.formGroup.get('creatingNew').setValue(false);
  }
  createBuyerCompany() {
    const id = this.formGroup.get('_id').value;
    const buyerId = this.formGroup.value.buyerEntityId;
    const { entity } = this.formGroup.get('company').value;
    this.store.dispatch(createBuyerCompanyOnboarding({ entity, buyerId }));
  }
  patchBuyerCompany(step: string) {
    const stepValue = this.formGroup.get('company').value[step];
    const { value: id } = this.formGroup.get('_id');
    const buyerId = this.formGroup.value.buyerEntityId;
    this.store.dispatch(patchBuyerCompanyOnboarding({ buyerId, id, buyer: stepValue, step }));
  }
}
