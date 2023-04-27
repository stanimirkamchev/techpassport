import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

import { Destroyable } from '@abstract/destroyable';
import { Router } from '@angular/router';
import { ApiService } from '@services/api/api.service';
import { TextConstants } from '@shared/text-constants';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  templateUrl: './page-header.component.html',
  selector: 'onboarding-page-header',
  styleUrls: ['./page-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageHeaderComponent extends Destroyable implements OnInit {
  @Input() title: string;
  public isSupplierStarted$: Observable<boolean>;
  public productSettingsMessage = TextConstants.YouNeedToAddDetailsToYourProfileToSeeProductSettings;

  constructor(
    public router: Router,
    private apiService: ApiService,
  ) {
    super();
  }

  ngOnInit() {
    this.getSupplierStatus();
  }

  getSupplierStatus() {
    this.isSupplierStarted$ = this.apiService.getSupplierStatus().pipe(
      map(x => x.body.status === 'started')
    );
    // this.isSupplierStarted$ = of(false);
  }
}
