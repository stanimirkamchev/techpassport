import { Destroyable } from '@abstract/destroyable';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { IMultiCheckboxOption } from '@shared/models/checbox.options';

@Component({
  selector: 'region-multi-checkbox',
  templateUrl: './region-multi-checkbox.component.html',
  styleUrls: ['./region-multi-checkbox.component.scss']
})
export class RegionMultiCheckboxComponent extends Destroyable implements OnInit {
  @Input() options: IMultiCheckboxOption[];
  @Input() formGroup: FormGroup;
  @Input() multi = true;
  @Input() allowNA = false;
  @Input() values: string[] = [];
  @Input() isError: boolean;
  @Input() errorText: string;
  @Input() value: string;
  @Input() label: string;
  @Output() valueChanged = new EventEmitter<any>();
  @Output() change = new EventEmitter();
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  public naField = false;
  public disabled = false;

  constructor(public router: Router) {
    super();
  }

  ngOnInit() {
    if (this.allowNA) {
      this.naField = true;
      for (const key of Object.keys(this.formGroup.value)) {
        if (this.formGroup.get(key).value) {
          this.naField = false;
        }
      }
    }
  }

  selectionChanged($event: MatCheckboxChange) {
    const value = $event.checked;
    if (!value && this.checkAllValuesAreNull()) {
      this.naField = true;
      for (const key of Object.keys(this.formGroup.value)) {
        this.formGroup.get(key).setValue(null);
      }
    } else {
      this.naField = false;
      this.valueChanged.emit($event);
    }
  }

  selectionNAChanged($event: MatCheckboxChange) {
    this.naField = true;
    for (const key of Object.keys(this.formGroup.value)) {
      this.formGroup.get(key).setValue(null);
    }
  }

  displayCross(item: IMultiCheckboxOption) {
    return item.name === 'none' || item.name === 'no' || item.name === 'country_none' || item.name === 'data_consumed_none';
  }

  private checkAllValuesAreNull() {
    let areNull = true;
    for (const key of Object.keys(this.formGroup.value)) {
      if (this.formGroup.get(key).value) {
        areNull = false;
      }
    }
    return areNull;
  }
}
