import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Destroyable } from '@abstract/destroyable';
import { FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { IMultiCheckboxOption } from '@shared/models/checbox.options';

@Component({
  selector: 'custom-multi-checkbox',
  templateUrl: './custom-multi-checkbox.component.html',
  styleUrls: ['./custom-multi-checkbox.component.scss']
})
export class CustomMultiCheckboxComponent extends Destroyable implements OnInit {
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

  constructor(public router: Router) {
    super();
  }

  ngOnInit() {
    if (this.allowNA && this.formGroup.get('yes').value == null && this.formGroup.get('no').value == null) {
      this.naField = true;
    }

    if (this.allowNA) {
      this.formGroup.valueChanges.subscribe(val => {
        this.naField = (val.yes == null || val.yes === false) && (val.no == null || val.no === false);
      });
    }
  }

  selectionChanged($event: MatCheckboxChange) {
    const value = $event.checked;
    if (!value) {
      this.naField = true;
      this.formGroup.get('yes').setValue(null);
      this.formGroup.get('no').setValue(null);
    } else {
      this.valueChanged.emit($event);
    }
  }

  selectionNAChanged($event: MatCheckboxChange) {
    this.naField = true;
    this.formGroup.get('yes').setValue(null);
    this.formGroup.get('no').setValue(null);
  }

  displayCross(item: IMultiCheckboxOption) {
    return item.name === 'none' || item.name === 'no' || item.name === 'country_none' || item.name === 'data_consumed_none';
  }
}
