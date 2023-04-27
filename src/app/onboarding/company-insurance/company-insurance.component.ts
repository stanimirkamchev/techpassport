import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';

import { Destroyable } from '@abstract/destroyable';
import { FormGroup } from "@angular/forms";

@Component({
  templateUrl: './company-insurance.component.html',
  selector: 'company-insurance',
  styleUrls: ['./company-insurance.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyInsuranceComponent extends Destroyable implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() isMandatory: boolean;
  @Output() change = new EventEmitter();

  currencyOptions = [
    {
      label: '$',
      value: 'usd'
    },
    {
      label: '£',
      value: 'gbp'
    }
  ];

  constructor() {
    super();
  }

  ngOnInit(): void {

  }
}
