import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';

import { Destroyable } from '@abstract/destroyable';

@Component({
  templateUrl: './top-bar.component.html',
  selector: 'onboarding-top-bar',
  styleUrls: ['./top-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopBarComponent extends Destroyable implements OnInit {
  @Input() active: boolean;
  @Input() supplierIsInProgress: boolean;

  constructor() {
    super();
  }

  ngOnInit() { }
}
