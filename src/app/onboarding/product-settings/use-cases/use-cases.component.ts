import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, forwardRef } from '@angular/core';

import { Destroyable } from '@abstract/destroyable';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { ApiService } from '@services/api/api.service';
import { takeUntil } from "rxjs/operators";
import { ProductCollateralComponent } from '../product-collateral/product-collateral.component';

@Component({
  templateUrl: './use-cases.component.html',
  selector: 'product-use-cases',
  styleUrls: ['./use-cases.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UseCasesComponent),
    multi: true
  }]
})
export class UseCasesComponent extends Destroyable implements OnInit, ControlValueAccessor {
  useCasesForm: FormGroup;
  loading = false;
  onChangeFn: Function
  onTouched: Function

  weekOptions = [
    {
      label: 'Monday',
      value: 'Monday'
    },
    {
      label: 'Tuesday',
      value: 'Tuesday'
    },
    {
      label: 'Wednesday',
      value: 'Wednesday'
    },
    {
      label: 'Thursday',
      value: 'Thursday'
    },
    {
      label: 'Friday',
      value: 'Friday'
    },
    {
      label: 'Saturday',
      value: 'Saturday'
    },
    {
      label: 'Sunday',
      value: 'Sunday'
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
  ) {
    super();
  }

  ngOnInit() {
    this.useCasesForm = this.formBuilder.group({
      useCase: new FormControl(true),
      useCases: new FormControl(''),
    });
    this.useCasesForm.valueChanges.subscribe((value) => this.onChange(value))
  }

  writeValue(value: any): void {
    this.useCasesForm.patchValue(value || {})
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  onChange(value) {
    if (typeof this.onChangeFn === 'function') {
      this.onChangeFn(value)
    }
  }
}
