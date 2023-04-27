import { Component, Input, OnInit } from '@angular/core';
import { ICheckboxOptions } from '@shared/models/checbox.options';
import { CheckboxOptions } from '@shared/custom-form-elements/static/CheckboxOptions';
import { ControlContainer, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-ssdlc',
  templateUrl: './ssdlc.component.html',
  styleUrls: ['./ssdlc.component.scss']
})
export class SsdlcComponent implements OnInit {
  yesNoOptions: ICheckboxOptions[] = CheckboxOptions.yesNoOptions;
  formGroup: FormGroup;

  constructor(
    public controlContainer: ControlContainer,
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this.controlContainer.control as FormGroup;
  }

  penetrationTestCoveringValue() {
    return this.formGroup.controls.penetrationTestCovering.value;
  }

  onPenetrationTestCoveringValueChange($event: any) {
    this.formGroup.controls.penetrationTestCovering.setValue($event);
  }
}
