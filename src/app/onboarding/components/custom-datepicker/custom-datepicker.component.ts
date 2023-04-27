import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';

import { Destroyable } from '@abstract/destroyable';
import { Router } from "@angular/router";
import {FormGroup} from "@angular/forms";

@Component({
  templateUrl: './custom-datepicker.component.html',
  selector: 'app-custom-datepicker',
  styleUrls: ['./custom-datepicker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomDatepickerComponent extends Destroyable implements OnInit {
  @Input() label: string;
  @Input() placeholder: string;
  @Input() formControlName?: string;
  @Input() formGroup?: FormGroup;

  constructor(public router: Router) {
    super();
  }

  ngOnInit() {
  }
}
