import { ControlValueAccessor, FormGroup } from '@angular/forms';
import { Input, OnDestroy, OnInit, Injectable, Directive } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

export abstract class OnboardingValueAccessor<T> implements ControlValueAccessor {

  abstract formGroup: FormGroup;

  onChange = (_: Partial<T>) => {};
  onTouched = () => {};

  writeValue(value: Partial<T>) {
    value && this.formGroup && this.formGroup.patchValue(value);
  }
  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
}

@Directive()
export abstract class OnboardingStepAbstract<T> extends OnboardingValueAccessor<T> {
  @Input() formGroup: FormGroup;
}

@Directive()
export abstract class OnboardingStepperAbstract<T> extends OnboardingValueAccessor<T> implements OnInit, OnDestroy {
  formGroup: FormGroup;
  protected destroyed$ = new Subject();

  ngOnInit() {
    this.formGroup.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .pipe(debounceTime(300))
      .subscribe(changes => this.onChange(changes));
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
