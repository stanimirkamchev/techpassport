import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';

import { Destroyable } from '@abstract/destroyable';
import { Router } from "@angular/router";
import {FormGroup} from "@angular/forms";

@Component({
  templateUrl: './custom-textarea.component.html',
  selector: 'app-custom-textarea',
  styleUrls: ['./custom-textarea.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomTextareaComponent extends Destroyable implements OnInit {
  @Input() label: string;
  @Input() placeholder: string;
  @Input() formControlName: string;
  @Input() formGroup: FormGroup;
  @Input() isError: boolean;
  @Input() errorText: string;


  constructor(public router: Router) {
    super();
  }

  ngOnInit() {
  }
}
