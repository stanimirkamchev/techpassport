import { Component, OnInit, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { OnboardingStepAbstract } from '../../onboarding.abstract';
import { Buyer } from '../../store/buyer/buyer.model';

@Component({
  selector: 'buyer-invoices-step',
  templateUrl: './buyer-invoices-step.component.html',
  styleUrls: ['./buyer-invoices-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => BuyerInvoicesStepComponent),
    multi: true
  }]
})
export class BuyerInvoicesStepComponent extends OnboardingStepAbstract<Buyer> {}
