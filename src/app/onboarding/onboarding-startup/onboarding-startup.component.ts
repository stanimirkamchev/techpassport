import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';

import { State } from '../../dashboard/store/dashboard.reducer';
import { Destroyable } from '@abstract/destroyable';

@Component({
  templateUrl: './onboarding-startup.component.html',
  selector: 'onboarding-startup',
  styleUrls: ['./onboarding-startup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnboardingStartupComponent extends Destroyable implements OnInit {
  constructor(private store: Store<State>) {
    super();
  }

  ngOnInit() {
  }
}
