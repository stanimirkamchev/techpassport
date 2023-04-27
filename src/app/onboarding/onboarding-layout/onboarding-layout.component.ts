import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';

import { State } from '../../dashboard/store/dashboard.reducer';
import { Destroyable } from '@abstract/destroyable';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  templateUrl: './onboarding-layout.component.html',
  selector: 'onboarding-layout',
  styleUrls: ['./onboarding-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnboardingLayoutComponent extends Destroyable implements OnInit {

  page: 'profile' | 'profile-start' | 'product-list' | 'product-edit' | 'product-new' = 'profile';
  constructor(private store: Store<State>, private router: Router, private route: ActivatedRoute, private cdRef: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.page = params.onboardingPage || 'profile';
      this.router.navigate([], {
        queryParams: { onboardingPage: this.page },
        queryParamsHandling: 'merge',
        relativeTo: this.route
      });
      this.cdRef.detectChanges();
    });
  }
}
