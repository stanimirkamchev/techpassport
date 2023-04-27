import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { IMultiCheckboxOption } from '@shared/models/checbox.options';
import { MultiCheckboxOptions } from '@shared/custom-form-elements/static/CheckboxOptions';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { of } from 'rxjs';

@Component({
  selector: 'data-deletion-retention',
  templateUrl: './data-deletion-retention.component.html',
  styleUrls: ['./data-deletion-retention.component.scss']
})
export class DataDeletionRetentionComponent implements OnInit {
  yesNoOptions: IMultiCheckboxOption[] = MultiCheckboxOptions.yesNoOptions;
  formGroup: FormGroup;
  maintainMultipleCopiesOfData$ = of(false);
  deleteAbility$ = of(false);
  provideACopy$ = of(false);

  constructor(
    public controlContainer: ControlContainer,
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this.controlContainer.control as FormGroup;
    this.deleteAbility$ = of(this.formGroup.get('deleteAbility').value ? true : false);
    this.provideACopy$ = of(this.formGroup.get('provideACopy').value ? true : false);
  }

  deleteAbility() {
    return this.formGroup.get('deleteAbility').value;
  }

  onDeleteAbilityChange($event: any) {
    this.deleteAbility$ = of($event);
    this.formGroup.get('deleteAbility').setValue($event);
    if (!$event) {
      this.formGroup.get('currentProcessExplanationOfDeletingCustomersData').setValue(null);
    }
  }

  onProvideACopyChange($event: any) {
    this.provideACopy$ = of($event);
    this.formGroup.get('provideACopy').setValue($event);
    if (!$event) {
      this.formGroup.get('currentProcessExplanationOfCopyingCustomersData').setValue(null);
    }
  }

  provideACopy() {
    return this.formGroup.get('provideACopy').value;
  }

  maintainMultipleCopiesOfDataChanged($event: MatCheckboxChange) {
    const source = $event.source;
    switch (source.name) {
      case 'yes':
        this.formGroup.controls.maintainMultipleCopiesOfData.get('no').setValue(null);
        // this.maintainMultipleCopiesOfData$ = of(false);
        break;
      case 'no':
        this.formGroup.controls.maintainMultipleCopiesOfData.get('yes').setValue(null);
        // this.maintainMultipleCopiesOfData$ = of(false);
        break;
    }
  }
}
