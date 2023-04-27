import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { Destroyable } from '@abstract/destroyable';
import { Router } from '@angular/router';

@Component({
  templateUrl: './custom-checkbox.component.html',
  selector: 'app-custom-checkbox',
  styleUrls: ['./custom-checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomCheckboxComponent extends Destroyable implements OnInit {
  @Input() label: string;
  @Input() value: boolean;

  @Output() change = new EventEmitter();

  constructor(public router: Router) {
    super();
  }

  ngOnInit() { }

  onChange(value: any) {
    this.change.emit(value);
  }
}
