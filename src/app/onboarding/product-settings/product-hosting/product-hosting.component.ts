import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, forwardRef, Input } from '@angular/core';

import { Destroyable } from '@abstract/destroyable';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { ApiService } from '@services/api/api.service';
import { takeUntil } from 'rxjs/operators';
import { ProductCollateralComponent } from '../product-collateral/product-collateral.component';
import { FormTracker } from '../../form-tracker';


@Component({
  templateUrl: './product-hosting.component.html',
  selector: 'product-hosting',
  styleUrls: ['./product-hosting.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ProductHostingComponent),
    multi: true
  }]
})
export class ProductHostingComponent extends Destroyable implements OnInit, ControlValueAccessor {
  productHostingForm: FormGroup;
  loading = false;
  onChangeFn: Function;
  onTouched: Function;
  @Input() submitted = false;
  @Input() formName: string;

  hostOptions = [
    {
      label: 'AWS',
      value: 'AWS'
    },
    {
      label: 'Azure',
      value: 'Azure'
    },
    {
      label: 'Google',
      value: 'Google'
    },
    {
      label: 'IBM',
      value: 'IBM'
    },
    {
      label: 'Other',
      value: 'Other'
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private tracker: FormTracker,
  ) {
    super();
  }

  ngOnInit() {
    this.productHostingForm = this.formBuilder.group({
      isCloud: new FormControl(true),
      hostLocation: new FormControl('', [Validators.required]),
      willHostLocation: new FormControl([]),
      haveMultipleHosting: new FormControl(false),
      multipleHostLocation: new FormControl([], [Validators.required]),
      thirdPartyInfrastructure: new FormControl(true),
      hasPremSolution: new FormControl(true)
    });
    this.tracker.tracking(this.formName, 'ProductHostingComponent', this.productHostingForm.valid);
    this.productHostingForm.valueChanges.subscribe((value) => this.onChange(value));
    this.productHostingForm.get('isCloud').valueChanges.subscribe((value) => {
      if (value) {
        this.productHostingForm.get('hostLocation').setValidators(Validators.required);
        this.productHostingForm.get('hostLocation').updateValueAndValidity();
      } else {
        this.productHostingForm.get('hostLocation').clearValidators();
        this.productHostingForm.get('hostLocation').updateValueAndValidity();
      }
      this.productHostingForm.updateValueAndValidity();
      this.tracker.tracking(this.formName, 'ProductHostingComponent', this.productHostingForm.valid);
    });
  }

  writeValue(value: any): void {
    this.productHostingForm.patchValue(value || {});
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
      this.tracker.tracking(this.formName, 'ProductHostingComponent', this.productHostingForm.valid);
    }
  }
}
