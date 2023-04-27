import { Component, Input, OnInit } from '@angular/core';
import { ICheckboxOptions } from '@shared/models/checbox.options';
import { CheckboxOptions } from '@shared/custom-form-elements/static/CheckboxOptions';
import { ControlContainer, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-breach-notification',
  templateUrl: './breach-notification.component.html',
  styleUrls: ['./breach-notification.component.scss']
})
export class BreachNotificationComponent implements OnInit {
  yesNoOptions: ICheckboxOptions[] = CheckboxOptions.yesNoOptions;
  formGroup: FormGroup;

  constructor(
    public controlContainer: ControlContainer,
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this.controlContainer.control as FormGroup;
  }

  breachNotificationValue() {
    return this.formGroup.controls.breachNotification.value;
  }

  onBreachNotificationValueChange($event: any) {
    this.formGroup.controls.breachNotification.setValue($event);
  }
}
