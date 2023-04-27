import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Destroyable } from '@abstract/destroyable';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomInputComponent extends Destroyable implements OnInit {
  @Input() label: string;
  @Input() placeholder: string;
  @Input() type = 'text';
  @Input() formControlName?: string;
  @Input() formGroup?: FormGroup;
  @Input() isError: boolean;
  @Input() errorText: string;

  constructor(public router: Router) { super(); }

  ngOnInit() { }

}
