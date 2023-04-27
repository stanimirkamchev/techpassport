import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { PopUpService } from '@shared/pop-up-service';
import { ApiService } from '@services/api/api.service';
import { EventEmitterService } from '@services/event-emitter/event-emitter.service';

import { PageService } from '@shared/page-service';

@Component({
  selector: 'app-portal',
  templateUrl: './portal.component.html',
  styleUrls: ['./portal.component.scss'],
})
export class PortalPageComponent implements OnInit {
  public portalReady = false;
  public page = '';
  public pageTitle = '';
  public pagesList = [];
  private hasSession = false;
  //  public customerReady = false;
  constructor(
    private popUpService: PopUpService,
    private pageService: PageService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public apiService: ApiService,
    private eventEmitterService: EventEmitterService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.matIconRegistry.addSvgIcon(
      'custom1', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/emailPlus.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'custom', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/monitoring.svg')
    );
    this.popUpService.popUpOverview.subscribe((data: any) => {
      this.changePage(data.items[0]);
    });

    this.pageService.flag$.subscribe((page: string) => {
      this.page = page;
    });
  }

  public get isAdmin() {
    return this.apiService.sessionObject.role === 'admin' || this.apiService.sessionObject.role === 'superadmin' || localStorage.getItem('isAdmin') === 'portalAdmin';
  }

  ngOnInit() {
    // this.apiService.sessionObject.type = 'customer'
    try {
      (document.getElementById('bgvid') as any).stop();
      document.getElementById('bgvid').style.display = 'none';
    } catch (error) { }

    this.eventEmitterService.onSessionCheckedEvent.subscribe(
      (hasSession: boolean, deails: string) => {
        this.checkSession();
      }
    );

    this.eventEmitterService.onChangePageEvent.subscribe(
      (page: string) => {
        this.changePage(page);
      }
    );

    const page = this.route.snapshot.queryParams.page || 'dashboard';

    this.checkSession();
    if (page) {
      this.changePage(page);
    }

    this.route.queryParams.subscribe(params => {
      this.page = params.page;
    });

    // this.customerReady = true;
  }

  helpcentre() {
    window.open('https://techpassport.zendesk.com/hc/en-gb', '_blank');
  }

  checkSession() {
    this.hasSession = this.apiService.sessionObject.hasSession;
    this.pagesList = [];
    this.pagesList.push({
      id: 'dashboard',
      label: 'DASHBOARD',
      icon: 'dashboard',
      // disabled: this.apiService.sessionObject.type === "customer",
      // tooltip: "Coming Soon!",
    });
    this.pagesList.push({
      id: 'poc',
      label: 'CONNECTIONS',
      icon: 'flight',
    });

    if (this.apiService.sessionObject.type === 'customer') {
      this.pagesList.push({ id: 'market', label: 'Marketplace', icon: 'cart' });
      this.pagesList.push({ id: 'watchlist', label: 'Watchlists', icon: 'eye' });
    }
    if (this.apiService.sessionObject.type === 'customer') {
      this.pagesList.push({
        id: 'outer-market-page',
        label: 'Outermarket',
        icon: 'language',
      });
    }
    this.pagesList.push({
      id: 'team',
      label: 'TEAM',
      icon: 'team',
    });

    this.pagesList.push({
      id: 'faq',
      label: 'FAQ',
      icon: 'faq',
    });

    this.portalReady = true;
  }

  changePage(page: string) {
    if (page === 'faq') {
      this.helpcentre();
      return;
    }

    if (this.isAdmin && !page) {
      page = 'admin/superuser';
      window.location.href = '/admin/superuser';
    }
    this.page = page;
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParams: { page },
    });
    for (const p of this.pagesList) {
      if (p.id === page) {
        this.pageTitle = p.label;
        break;
      }
    }
  }
}
