import { Component, OnInit } from '@angular/core';
import { IMultiCheckboxOption } from '@shared/models/checbox.options';
import { MultiCheckboxOptions } from '@shared/custom-form-elements/static/CheckboxOptions';
import { ControlContainer, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-data-privacy',
  templateUrl: './data-privacy.component.html',
  styleUrls: ['./data-privacy.component.scss']
})
export class DataPrivacyComponent implements OnInit {
  formGroup: FormGroup;
  countryRegionOptions: IMultiCheckboxOption[] = [
    { label: 'UK', selected: true, name: 'country_uk', disabled: false },
    { label: 'USA', selected: false, name: 'country_usa', disabled: false },
    { label: 'Canada', selected: false, name: 'country_canada', disabled: false },
    { label: 'European Union', selected: false, name: 'country_eu', disabled: false },
    { label: 'None of the above', selected: false, name: 'country_none', disabled: false }
  ];
  dataProtectionLegislationOptions: IMultiCheckboxOption[] = [
    { label: 'UK', selected: true, name: 'legislation_uk', disabled: false },
    { label: 'USA', selected: false, name: 'legislation_usa', disabled: false },
    { label: 'Canada', selected: false, name: 'legislation_canada', disabled: false },
    { label: 'European Union', selected: false, name: 'legislation_eu', disabled: false }
  ];
  protectionActOptions: IMultiCheckboxOption[] = [
    { label: 'GDPR', selected: true, name: 'gdpr', disabled: false },
    { label: 'CCPA', selected: false, name: 'ccpa', disabled: false },
    { label: 'PIPEDA', selected: false, name: 'pipeda', disabled: false },
    { label: 'Other', selected: false, name: 'other', disabled: false },
  ];
  whereTheDataIsConsumed: IMultiCheckboxOption[] = [
    { label: 'UK', selected: true, name: 'data_consumed_uk', disabled: false },
    { label: 'USA', selected: false, name: 'data_consumed_usa', disabled: false },
    { label: 'Canada', selected: false, name: 'data_consumed_canada', disabled: false },
    { label: 'European Union', selected: false, name: 'data_consumed_eu', disabled: false },
    { label: 'None of the above', selected: false, name: 'data_consumed_no', disabled: false }
  ];
  yesNoOptions: IMultiCheckboxOption[] = MultiCheckboxOptions.yesNoOptions;
  protectionActOtherOptionSelected$: Observable<boolean>;

  constructor(
    public controlContainer: ControlContainer,
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this.controlContainer.control as FormGroup;
  }

  onWhereDataIsConsumedChanged($event: MatCheckboxChange) {
    const source = $event.source.name;
    const value = $event.checked;

    if (source === 'data_consumed_no' && value) {
      this.formGroup.controls.whereDataIsConsumed.get('data_consumed_uk').setValue(null);
      this.formGroup.controls.whereDataIsConsumed.get('data_consumed_usa').setValue(null);
      this.formGroup.controls.whereDataIsConsumed.get('data_consumed_canada').setValue(null);
      this.formGroup.controls.whereDataIsConsumed.get('data_consumed_eu').setValue(null);
    } else {
      this.formGroup.controls.whereDataIsConsumed.get('data_consumed_no').setValue(null);
    }
  }

  onProtectionActOptionsChanged($event: MatCheckboxChange) {
    const source = $event.source.name;
    const value = $event.checked;

    if (source === 'other' && value) {
      this.protectionActOtherOptionSelected$ = of(true);
    }
    else if (source === 'other' && !value) {
      this.protectionActOtherOptionSelected$ = of(null);
      this.formGroup.controls.protectionActOptions.get('otherText').setValue('');
    }
  }

  onCountryRegionOptionsChanged($event: MatCheckboxChange) {
    const source = $event.source.name;
    const value = $event.checked;

    if (source === 'country_none' && value) {
      this.formGroup.controls.countryRegionOptions.get('country_uk').setValue(null);
      this.formGroup.controls.countryRegionOptions.get('country_usa').setValue(null);
      this.formGroup.controls.countryRegionOptions.get('country_canada').setValue(null);
      this.formGroup.controls.countryRegionOptions.get('country_eu').setValue(null);
    } else {
      this.formGroup.controls.countryRegionOptions.get('country_none').setValue(null);
    }
  }

  inclusionPermissionsChanged($event: MatCheckboxChange) {
    const source = $event.source.name;

    switch (source) {
      case 'yes':
        this.formGroup.controls.inclusionPermissions.get('no').setValue(null);
        break;
      case 'no':
        this.formGroup.controls.inclusionPermissions.get('yes').setValue(null);
        break;
    }
  }
}
