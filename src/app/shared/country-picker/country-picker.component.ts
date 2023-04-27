import { Component, OnInit, ChangeDetectionStrategy, forwardRef, Input } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { getNames, getCode } from 'country-list';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';
import { Destroyable } from '@abstract/destroyable';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'country-picker',
  templateUrl: './country-picker.component.html',
  styleUrls: ['./country-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CountryPickerComponent),
    multi: true
  }]
})
export class CountryPickerComponent extends Destroyable implements OnInit {

  @Input() label: string;
  @Input() placeholder: string;
  @Input() allEnabled: string;
  @Input() multi: boolean;
  @Input() valid: boolean;
  @Input() inValid: boolean;
  @Input() set limit(limit: string[]) {
    if (limit) {
      this.countryList = this.countryList.filter(c => limit.indexOf(getCode(c)) > -1);
    }
  }

  formControl = new FormControl('');

  countryList = getNames().sort();

  getCountryCode = getCode;

  getUnicodeFlagIcon = getUnicodeFlagIcon;

  onChange = (_: string) => { };
  onTouched = () => { };

  writeValue(value: string) {
    this.formControl.patchValue(value);
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  ngOnInit() {
    this.formControl.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(value => this.onChange(value));
  }
}
