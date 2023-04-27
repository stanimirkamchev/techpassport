import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { Destroyable } from '@abstract/destroyable';
import { Router } from "@angular/router";

interface Option {
  label: string;
  value: string;
}

@Component({
  templateUrl: './custom-multi-checkbox.component.html',
  selector: 'app-custom-multi-checkbox',
  styleUrls: ['./custom-multi-checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomMultiCheckboxComponent extends Destroyable implements OnInit {
  @Input() label: string;
  @Input() options: Option[];
  @Input() values: string[] = [];
  @Input() value: string;
  @Input() multi = true;
  @Output() change = new EventEmitter();
  @Input() isError: boolean;
  @Input() errorText: string;

  constructor(public router: Router) {
    super();
  }

  ngOnInit() {
  }

  public toggle(option: Option) {

    if(this.multi) {
      let newValues = [];
      if ((this.values || [])?.includes(option.value)) {
        newValues = this.values.filter((item) => item !== option.value);
      } else {
        newValues = [...(this.values || []), option.value];
      }
      this.change.emit(newValues);
    } else {
      this.change.emit(option.value);
    }
  }

  public isActive(option: Option) {
    return this.multi? (this.values || [])?.includes(option.value) : this.value == option.value;
  }
}
