import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { Destroyable } from '@abstract/destroyable';
import { Router } from "@angular/router";

@Component({
  templateUrl: './custom-button.component.html',
  selector: 'app-custom-button',
  styleUrls: ['./custom-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomButtonComponent extends Destroyable implements OnInit {
  @Input() label: string;
  @Input() loading: boolean;
  @Input() disabled: boolean;
  @Output() onClick = new EventEmitter();

  constructor(public router: Router) {
    super();
  }

  ngOnInit() {
  }

  public handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.onClick.emit();
  }
}
