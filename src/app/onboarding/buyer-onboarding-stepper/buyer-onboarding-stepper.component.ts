import { Component, ChangeDetectionStrategy, Output, EventEmitter, OnInit, forwardRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { takeUntil, take, filter } from 'rxjs/operators';
import { pickBy, isNull } from 'lodash';
import { MatStepper } from '@angular/material/stepper';
import { ofType } from '@ngrx/effects';
import { ActionsSubject } from '@ngrx/store';

import { getEntityFormGroup, getInvoicesFormGroup } from '../onboarding.model';
import { Destroyable } from '@abstract/destroyable';
import { createBuyerOnboardingError, createBuyerOnboardingSuccess, patchBuyerOnboardingError, patchBuyerOnboardingSuccess } from '../store/buyer/buyer.actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'buyer-onboarding-stepper',
  templateUrl: './buyer-onboarding-stepper.component.html',
  styleUrls: ['./buyer-onboarding-stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => BuyerOnboardingStepperComponent),
    multi: true
  }]
})
export class BuyerOnboardingStepperComponent extends Destroyable implements ControlValueAccessor, OnInit {

  @Output() finish = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() create = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() patch = new EventEmitter<string>();
  @ViewChild('stepper', { static: false }) stepper: MatStepper;
  pendingAction = false;

  formGroup = new FormGroup({
    entity: getEntityFormGroup(),
    settings: new FormGroup({
      freePoCfile: new FormControl(),
      paidPoCfile: new FormControl(),
      ndafile: new FormControl()
    }),
    invoices: getInvoicesFormGroup(),
    group: new FormGroup({
      _id: new FormControl(''),
      acceptGroupEntityDefinition: new FormControl(true),
      customGroupEntityDefinition: new FormControl(''),
      company: new FormControl(''),
      buyerEntityId: new FormControl(''),
      creatingNew: new FormControl(false)
    }),
    dummy: new FormGroup({
      _id: new FormControl(''),
      onlyDummy: new FormControl(false, Validators.required)
    }),
    sanctions: new FormGroup({
      _id: new FormControl(''),
      countries: new FormControl([])
    }),
    saml: new FormGroup({
      _id: new FormControl(''),
      isSamlAuthenticated: new FormControl(false)
    }),
    invite: new FormGroup({
      _id: new FormControl(''),
      email: new FormControl('')
    })
  });

  // TODO: check SAML step
  // private steps = ['entity', 'invoices', 'group', 'dummy', 'sanctions', 'saml', 'invite'];
  private steps = ['entity', 'settings', 'invoices', 'group', 'dummy', 'sanctions', 'saml', 'invite'];

  constructor(private actionsListener$: ActionsSubject) {
    super();
  }

  ngOnInit() {
    this.actionsListener$
      .pipe(ofType(
        patchBuyerOnboardingSuccess, createBuyerOnboardingSuccess,
        patchBuyerOnboardingError, createBuyerOnboardingError))
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => this.pendingAction = false);
    this.formGroup.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(changes => this.onChange(changes));
  }

  onChange = (_: any) => { };
  onTouched = () => { };

  writeValue(value: any) {
    if (value) {
      const { creatingNew } = this.formGroup.get('group').value;
      this.formGroup.patchValue({
        ...pickBy(value, v => !isNull(v)),
        group: {
          buyerEntityId: value.entity._id,
          ...value.group,
          creatingNew
        }
      });
    }
  }
  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
  saveAndClose(current: number) {
    if (this.shouldChangeNow(current)) {
      return this.close.emit();
    }
    this.pendingAction = true;
    this.onSuccess(current).subscribe(() => this.close.emit());
  }
  justClose(current: number) {
    return this.close.emit();
  }


  next(current: number, step?: string ) {
    if (this.shouldChangeNow(current)) {
      return this.stepper.next();
    }
    if(step !== 'saml') {
      this.pendingAction = true;
      this.onSuccess(current).subscribe(() => this.stepper.next());
    } else {
      this.stepper.next()
    }
  }

  previous(current: number) {
    if (this.shouldChangeNow(current)) {
      return this.stepper.previous();
    }
    this.pendingAction = true;
    this.onSuccess(current).subscribe(() => this.stepper.previous());
  }

  private onSuccess(current: number): Observable<any> {
    return this.actionsListener$
      .pipe(ofType(patchBuyerOnboardingSuccess, createBuyerOnboardingSuccess))
      .pipe(filter(({ step }) => step === this.steps[current]))
      .pipe(takeUntil(this.destroyed$), take(1));
  }

  private shouldChangeNow(previous: number): boolean {
    const step = this.steps[previous];
    const group = this.formGroup.get(step);
    if (!group || group.invalid || previous === 1) {
      return true;
    }
    if (previous === 0 && !group.value._id) {
      this.create.emit();
      return false;
    }
    else {
      this.patch.emit(step);
      return false;
    }
  }
}
