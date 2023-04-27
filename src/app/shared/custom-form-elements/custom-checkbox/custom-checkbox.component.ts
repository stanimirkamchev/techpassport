import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Destroyable } from '@abstract/destroyable';

@Component({
  selector: 'custom-checkbox',
  templateUrl: './custom-checkbox.component.html',
  styleUrls: ['./custom-checkbox.component.scss']
})
export class CustomCheckboxComponent extends Destroyable implements OnInit {
  @Input() label: string;
  @Input() allowNA = false;
  @Input() value: boolean = undefined;
  @Output() change = new EventEmitter();

  constructor() { super(); }

  ngOnInit(): void { }

  onChange(value: any) {
    this.change.emit(value);
  }
}
