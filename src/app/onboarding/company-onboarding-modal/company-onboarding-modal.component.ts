import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import { State } from '../store';
import { Company } from '../store/company/company.model';
import { getEntityFormGroup, getInvoicesFormGroup } from '../onboarding.model';

@Component({
  templateUrl: './company-onboarding-modal.component.html',
  styleUrls: ['./company-onboarding-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyOnboardingModalComponent {

  formGroup = new FormGroup({
    company: new FormGroup({
      entity: getEntityFormGroup(),
      invoices: getInvoicesFormGroup()
    })
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { company?: Company, step: number },
    private store: Store<State>) { }

  patchCompanyOnboarding({ _id: id, ...company }: Company) {
    // this.store.dispatch(patchCompanyOnboarding({ id, company }));
  }
}
