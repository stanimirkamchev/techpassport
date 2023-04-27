import { Component, OnInit, Output, EventEmitter, forwardRef, Input } from '@angular/core';

import { Destroyable } from '@abstract/destroyable';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { FormTracker } from '../../form-tracker';


@Component({
  templateUrl: './product-charges.component.html',
  selector: 'product-charges',
  styleUrls: ['./product-charges.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ProductChargesComponent),
    multi: true
  }]
})
export class ProductChargesComponent extends Destroyable implements OnInit, ControlValueAccessor {
  chargeForm: FormGroup;
  onChangeFn: Function;
  onTouched: Function;
  @Input() submitted = false;
  @Input() formName: string;
  @Input() onlyMandatory: boolean;

  trialOptions = [
    {
      label: 'Yes, fixed fee',
      value: 'fixedFee'
    },
    // {
    //   label: 'Yes, use case dependent',
    //   value: 'useCase'
    // },
    {
      label: 'No, it’s free',
      value: 'free'
    }
  ];

  rrpOptions = [
    {
      label: 'A fixed amount',
      value: 'fixed'
    },
    {
      label: 'Volume based',
      value: 'volume'
    }
  ];

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

  constructor(
    private formBuilder: FormBuilder,
    private tracker: FormTracker,
  ) {
    super();
  }

  ngOnInit() {
    this.chargeForm = this.formBuilder.group({
      trial: new FormControl(undefined, [Validators.required]),
      description: new FormControl(''),
      trialFeeUseCaseDetails: new FormControl(''),
      currency: new FormControl(''),
      chargesAmtFee: new FormControl(0, [Validators.required]),
      rrp: new FormControl(undefined),
      rrpAmount: new FormControl(0, [Validators.required]),
      rrpFeeDetails: new FormControl('')
    });
    this.chargeForm.valueChanges.subscribe((value) => this.onChange(value));
    this.tracker.tracking(this.formName, 'ProductChargesComponent', this.chargeForm.valid);
    this.chargeForm.get('trial').valueChanges.subscribe(value => {
      this.chargeForm.get('chargesAmtFee').clearValidators();
      this.chargeForm.get('chargesAmtFee').updateValueAndValidity();
      this.chargeForm.get('description').clearValidators();
      this.chargeForm.get('description').updateValueAndValidity();
      if (value === 'fixedFee') {
        this.chargeForm.get('chargesAmtFee').setValidators(Validators.required);
        this.chargeForm.get('chargesAmtFee').updateValueAndValidity();
        this.chargeForm.get('description').setValidators(Validators.required);
        this.chargeForm.get('description').updateValueAndValidity();
      }
      if (value === 'useCase') {
        this.chargeForm.get('description').setValidators(Validators.required);
        this.chargeForm.get('description').updateValueAndValidity();
      }
      this.chargeForm.updateValueAndValidity();
      this.tracker.tracking(this.formName, 'ProductChargesComponent', this.chargeForm.valid);
    });

    this.chargeForm.get('rrp').valueChanges.subscribe(value => {
      if (value === 'fixed') {
        this.chargeForm.get('rrpAmount').setValidators(Validators.required);
        this.chargeForm.get('rrpAmount').updateValueAndValidity();
      } else {
        this.chargeForm.get('rrpAmount').setValidators(Validators.required);
        this.chargeForm.get('rrpAmount').updateValueAndValidity();
      }
      this.chargeForm.updateValueAndValidity();
      this.tracker.tracking(this.formName, 'ProductChargesComponent', this.chargeForm.valid);
    });
  }

  writeValue(value: any): void {
    this.chargeForm.patchValue(value || {});
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onChange(value) {
    if (typeof this.onChangeFn === 'function') {
      this.onChangeFn(value);
      this.tracker.tracking(this.formName, 'ProductChargesComponent', this.chargeForm.valid);
    }
  }
}
