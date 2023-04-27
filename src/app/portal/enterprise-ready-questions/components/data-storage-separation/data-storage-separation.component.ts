import { Component, OnInit } from '@angular/core';
import { ICheckboxOptions, IMultiCheckboxOption } from '@shared/models/checbox.options';
import { CheckboxOptions } from '@shared/custom-form-elements/static/CheckboxOptions';
import { ControlContainer, FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { of } from 'rxjs';

@Component({
  selector: 'app-data-storage-separation',
  templateUrl: './data-storage-separation.component.html',
  styleUrls: ['./data-storage-separation.component.scss']
})
export class DataStorageSeparationComponent implements OnInit {
  serviceProvidedCountriesOtherInputVisible$ = of(false);
  dataMaintenanceCountriesOtherInputVisible$ = of(false);
  formGroup: FormGroup;
  countryRegionOptions: IMultiCheckboxOption[] = [
    { label: 'UK', selected: false, name: 'country_uk', disabled: false },
    { label: 'USA', selected: false, name: 'country_usa', disabled: false },
    { label: 'Canada', selected: false, name: 'country_canada', disabled: false },
    { label: 'European Union', selected: false, name: 'country_eu', disabled: false },
    { label: 'Other', selected: false, name: 'country_other', disabled: false }
  ];
  guaranteeLocationCheck = false;
  onRobustLogicalSegregationValueCheck$ = of(false);
  onSeparateDataSetAccessValueCheck$ = of(false);
  onProcessChangeManagementValueCheck$ = of(false);

  constructor(
    public controlContainer: ControlContainer,
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this.controlContainer.control as FormGroup;
    this.onRobustLogicalSegregationValueCheck$ = of(!!this.formGroup.get('logicalSegregation.utilize').value);
    this.onSeparateDataSetAccessValueCheck$ = of(!!this.formGroup.get('separateDataSetAccess.dataSetAccess').value);
    this.onProcessChangeManagementValueCheck$ = of(!!this.formGroup.get('processChangeManagement.changeManagement').value);
  }

  guaranteeLocationValue() {
    return this.formGroup.get('guaranteeLocation')?.value;
  }

  onGuaranteeLocationValueChange($event: any) {
    this.formGroup.get('guaranteeLocation')?.setValue($event);
    this.guaranteeLocationCheck = $event;
  }

  robustLogicalSegregationValue() {
    return this.formGroup.get('logicalSegregation.utilize')?.value;
  }

  separateDataSetAccessValue() {
    return this.formGroup.get('separateDataSetAccess.dataSetAccess')?.value;
  }

  processChangeManagementValue() {
    return this.formGroup.get('processChangeManagement.changeManagement')?.value;
  }

  onRobustLogicalSegregationValueChange($event: any) {
    this.formGroup.get('logicalSegregation.utilize')?.setValue($event);
    this.onRobustLogicalSegregationValueCheck$ = of($event);
  }

  onSeparateDataSetAccessValueChange($event: any) {
    this.formGroup.get('separateDataSetAccess.dataSetAccess')?.setValue($event);
    this.onSeparateDataSetAccessValueCheck$ = of($event);
  }

  onProcessChangeManagementValueChange($event: any) {
    this.formGroup.get('processChangeManagement.changeManagement')?.setValue($event);
    this.onProcessChangeManagementValueCheck$ = of($event);
  }

  onServiceProvidedCountryRegionsChanged($event: MatCheckboxChange) {
    const source = $event.source.name;
    const checked = $event.checked;

    if (source === 'country_other' && checked) {
      this.serviceProvidedCountriesOtherInputVisible$ = of(true);
    }
    else if (source === 'country_other' && !checked) {
      this.serviceProvidedCountriesOtherInputVisible$ = of(false);
    }
  }

  onDataMaintenanceLocationsChanged($event: MatCheckboxChange) {
    const source = $event.source.name;
    const checked = $event.checked;

    if (source === 'country_other' && checked) {
      this.dataMaintenanceCountriesOtherInputVisible$ = of(true);
    }
    else if (source === 'country_other' && !checked) {
      this.dataMaintenanceCountriesOtherInputVisible$ = of(false);
      this.formGroup.get(['dataMaintenanceLocations', 'country_other_text']).setValue(null);
    }
  }
}
