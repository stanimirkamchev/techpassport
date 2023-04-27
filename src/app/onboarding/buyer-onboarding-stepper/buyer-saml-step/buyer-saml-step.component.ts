import { Component, OnInit, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { OnboardingStepAbstract } from '../../onboarding.abstract';
import { Buyer } from '../../store/buyer/buyer.model';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'buyer-saml-step',
  templateUrl: './buyer-saml-step.component.html',
  styleUrls: ['./buyer-saml-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => BuyerSamlStepComponent),
    multi: true
  }]
})
export class BuyerSamlStepComponent extends OnboardingStepAbstract<Buyer> {
    constructor() {
        super();
      }
}
