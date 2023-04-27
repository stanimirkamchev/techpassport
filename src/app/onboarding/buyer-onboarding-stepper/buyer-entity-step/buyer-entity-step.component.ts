import { Component, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { Buyer } from '../../store/buyer/buyer.model';
import { OnboardingStepAbstract } from '../../onboarding.abstract';
import { CompanyType } from '../../onboarding.model';

@Component({
  selector: 'buyer-entity-step',
  templateUrl: './buyer-entity-step.component.html',
  styleUrls: ['./buyer-entity-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => BuyerEntityStepComponent),
    multi: true
  }]
})
export class BuyerEntityStepComponent extends OnboardingStepAbstract<Buyer> {

  CompanyType = CompanyType;
}
