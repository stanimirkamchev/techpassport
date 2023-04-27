import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

import { Destroyable } from '@abstract/destroyable';
import { Router } from '@angular/router';

@Component({
  templateUrl: './tabs.component.html',
  selector: 'onboarding-tabs',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent extends Destroyable implements OnInit {
  @Input() active: boolean;

  tabs = [
    {
      key: 0,
      icon: 'personal_settings',
      label: 'Personal Settings',
      path: '/onboarding/personal-settings'
    },
    {
      key: 1,
      icon: 'company_settings',
      label: 'Company Settings',
      path: '/onboarding/company-settings'
    },
    {
      key: 2,
      icon: 'product_settings',
      label: 'Product Settings',
      path: '/onboarding/product-settings'
    },
    {
      key: 3,
      icon: 'membership',
      label: 'Membership',
      path: '/onboarding/membership'
    }
  ];

  constructor(public router: Router) {
    super();
  }

  ngOnInit() {
  }
}
