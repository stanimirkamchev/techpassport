import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Destroyable } from '@abstract/destroyable';

@Component({
  selector: 'custom-text-area',
  templateUrl: './custom-text-area.component.html',
  styleUrls: ['./custom-text-area.component.scss']
})
export class CustomTextAreaComponent extends Destroyable implements OnInit {
  @Input() label: string;
  @Input() placeholder: string;
  @Input() formControlName: string;
  @Input() formGroup: FormGroup;
  @Input() isError: boolean;
  @Input() errorText: string;

  constructor(public router: Router) {
    super();
  }

  ngOnInit() { }
}
