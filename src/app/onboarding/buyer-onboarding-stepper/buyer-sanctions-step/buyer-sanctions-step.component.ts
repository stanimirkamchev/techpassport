import { Component, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { BuyerGroupCompanyStepComponent } from '../buyer-group-company-step/buyer-group-company-step.component';
import { OnboardingStepAbstract } from '../../onboarding.abstract';
import { Buyer } from '../../store/buyer/buyer.model';

@Component({
  selector: 'buyer-sanctions-step',
  templateUrl: './buyer-sanctions-step.component.html',
  styleUrls: ['./buyer-sanctions-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => BuyerGroupCompanyStepComponent),
    multi: true
  }]
})
export class BuyerSanctionsStepComponent extends OnboardingStepAbstract<Buyer> {
}
