import { Component, ChangeDetectionStrategy, OnInit, Output, EventEmitter, forwardRef } from '@angular/core';
import { FormGroup, FormControl, Validators, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Company } from '../store/company/company.model';
import { OnboardingStepperAbstract } from '../onboarding.abstract';
import { getEntityFormGroup, getInvoicesFormGroup } from '../onboarding.model';
import { Destroyable } from '@abstract/destroyable';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { pickBy, isNull } from 'lodash';

@Component({
  selector: 'company-onboarding-stepper',
  templateUrl: './company-onboarding-stepper.component.html',
  styleUrls: ['./company-onboarding-stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CompanyOnboardingStepperComponent),
    multi: true
  }]
})
export class CompanyOnboardingStepperComponent extends Destroyable implements ControlValueAccessor, OnInit {

  @Output() finish = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() create = new EventEmitter();
  @Output() patch = new EventEmitter<string>();

  formGroup = new FormGroup({
    entity: getEntityFormGroup(),
    invoices: getInvoicesFormGroup(),
  });

  ngOnInit() {
    this.formGroup.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .pipe(debounceTime(300))
      .subscribe(changes => this.onChange(changes));
  }

  onChange = (_: any) => { }
  onTouched = () => { };

  writeValue(value: any) {
    value && this.formGroup.patchValue(pickBy(value, v => !isNull(v)));
  }
  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  stepChange({ previouslySelectedIndex: previous }: StepperSelectionEvent) {
    const steps = ['entity', 'invoices'];
    const step = steps[previous];
    const group = this.formGroup.get(step);
    if (!group || group.invalid) {
      return;
    }
    if (previous === 0 && !group.value._id) {
      this.create.emit();
    }
    else {
      this.patch.emit(step);
    }
  }
}
