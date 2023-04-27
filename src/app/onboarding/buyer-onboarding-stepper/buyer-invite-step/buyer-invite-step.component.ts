import { Component, OnInit, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { OnboardingStepAbstract } from '../../onboarding.abstract';
import { Buyer } from '../../store/buyer/buyer.model';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'buyer-invite-step',
  templateUrl: './buyer-invite-step.component.html',
  styleUrls: ['./buyer-invite-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => BuyerInviteStepComponent),
    multi: true
  }]
})
export class BuyerInviteStepComponent extends OnboardingStepAbstract<Buyer> {
}
