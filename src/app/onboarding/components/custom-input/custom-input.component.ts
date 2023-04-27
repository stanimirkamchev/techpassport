import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';

import { Destroyable } from '@abstract/destroyable';
import { Router } from "@angular/router";
import {FormGroup} from "@angular/forms";

@Component({
  templateUrl: './custom-input.component.html',
  selector: 'app-custom-input',
  styleUrls: ['./custom-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomInputComponent extends Destroyable implements OnInit {
  @Input() label: string;
  @Input() placeholder: string;
  @Input() type: string = 'text';
  @Input() formControlName?: string;
  @Input() formGroup?: FormGroup;
  @Input() isError: boolean;
  @Input() errorText: string;
  @Input() positiveOnly: boolean

  constructor(public router: Router) {
    super();
  }

  ngOnInit() {
  }
}
