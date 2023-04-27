import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventEmitterService } from '@services/event-emitter/event-emitter.service';
import { ConnectMeService } from '@services/connectme/connectme.service';
import { ActivatedRoute, Event, NavigationStart, Router } from '@angular/router';
import { ApiService } from '@services/api/api.service';
import { Socket } from 'ngx-socket-io';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpResponse } from '@angular/common/http';
import { AlertModalComponent } from '@shared/modals/alert-modal/alert-modal.component';
import { CookieModalComponent } from '@shared/modals/cookie-modal/cookie-modal.component';
import { LoginModalComponent } from '@shared/modals/login-modal/login.component';
import { MembershipModalComponent } from '@shared/modals/membership-modal/membership-modal.component';
import { ProfileModalComponent } from '@shared/modals/profile-modal/profile-modal.component';
import { ContactModalComponent } from '../../portal/contact-modal/contact-modal.component';
import { UserOnboardingModalComponent } from '@shared/modals/user-onboarding-modal/user-onboarding-modal.component';
import { SupplierUpgradeModalComponent } from '../../supplier-upgrade-modal/supplier-upgrade-modal.component';
import { PocModalComponent } from '../../portal/poc-modal/poc-modal.component';
import { ReviewDialogComponent } from '@shared/modals/review-dialog/review-dialog.component';
import { SupplierOnboardingModalComponent } from '@shared/modals/supplier-onboarding-modal/supplier-onboarding-modal.component';
import { ProductOnboardingModalComponent } from '@shared/modals/product-onboarding-modal/product-onboarding-modal.component';
import { DocuSignComponent } from '@shared/modals/docu-sign-modal/docu-sign.component';
import { AssessmentComponent } from '../../portal/assessment-modal/assessment.component';
import { ConnectMeModalComponent } from '../../portal/connectme-modal/connectme-modal.component';
import { ExpireAlertComponent } from '@shared/modals/expire-alert/expire-alert.component';
import { VersionProviderService } from '@services/version-provider/version-provider.service';
import { overwrite, getData } from 'country-list';

export interface UiMenuOption {
  [key: string]: string;
}

let lastClickTimeStamp = 0;
export interface noteSatus {
  projectTitle: string;
  time: Date;
  person?: string;
  question?: string;
}
export interface noteMesage {
  _id: string;
  from: string;
  fromDN: string;
  productID: string;
  message: string;
  timestamp: Date;
}

@Component({
  selector: 'ui-header',
  templateUrl: './ui-header.component.html',
  styleUrls: ['./ui-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiHeaderComponent {
  public allNote = 0;
  public importantNote = false;
  public importantNoteProgress = false;
  public importantNoteDetails: any = {};
  public notificationStatus: noteSatus[] = [];
  public notificatioMessage: noteMesage[] = [];

  title = 'TechPassport';
  videoIsPlaying = false;
  firstRun = true;
  pingInterval = 0;
  logoutTimeout = null;
  alertTimeout = null;
  openSessionDialogRef = undefined;
  hasSocket = false;

  iHadThat = {};
  version = VersionProviderService.getVersion();
  private socketHasListeners = false;

  constructor(
    private cookieDialog: MatDialog,
    private registerDialog: MatDialog,
    private onboadringDialog: MatDialog,
    private docuSignDialog: MatDialog,
    private pocDialog: MatDialog,
    private contactDialog: MatDialog,
    private sessionDialog: MatDialog,
    private loginDialog: MatDialog,
    private connectMeDialog: MatDialog,
    private alertDialog: MatDialog,

    private eventEmitterService: EventEmitterService,
    private connectMeService: ConnectMeService,
    private router: Router,
    private route: ActivatedRoute,
    public apiService: ApiService,
    private socket: Socket,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    document.addEventListener('click', this.onDocument1Click);
    this.onDocument1Click();
    this.matIconRegistry.addSvgIcon(
      `personal_settings`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/img/onboarding/personal_settings.svg')
    );
    this.matIconRegistry.addSvgIcon(
      `company_settings`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/img/onboarding/company_settings.svg')
    );
    this.matIconRegistry.addSvgIcon(
      `product_settings`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/img/onboarding/product_settings.svg')
    );
    this.matIconRegistry.addSvgIcon(
      `membership`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/img/onboarding/membership.svg')
    );
    this.matIconRegistry.addSvgIcon(
      `heavy_check`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/img/onboarding/heavy_check.svg')
    );
    this.matIconRegistry.addSvgIcon(
      `camera`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/img/onboarding/camera.svg')
    );
  }

  onDocument1Click() {
    lastClickTimeStamp = new Date().getTime();
  }
  ngOnInit() {
    this.allNote = this.notificatioMessage.length + this.notificationStatus.length;
    this.initEventEmmiterListeners();

    this.initCookie();
    this.startVideo();
    this.initSessionUtils();
    this.sortCountries();
  }
  connectMeResposneBack(note: any, approved: boolean) {
    //
    this.connectMeService.connectMeRespond(note.id, approved, null, (data: HttpResponse<Object>) => {
      this.checkNotifications();
    },
      (respError: Error) => {
        this.checkNotifications();
      });
    // this.importantNoteProgress = true;
    /*this.connectMeService.signNDA(
      note.id,
      error => {
        if (!error)
          this.importantNote = false;

        this.importantNoteProgress = false;
      }
    );
    //nda here*/

  }

  sortCountries() {
    overwrite([{
      code: 'GB',
      name: 'United Kingdom'
    }]);
    const allCountries = getData();
    let GB, SG, US;

    for (const ind in allCountries) {
      if (allCountries[ind].code === 'GB') {
        GB = ind;
      }
      else if (allCountries[ind].code === 'SG') {
        SG = ind;
      }
      else if (allCountries[ind].code === 'US') {
        US = ind;
      }
    }
    allCountries.splice(0, 0, allCountries.splice(GB, 1)[0]);
    allCountries.splice(1, 0, allCountries.splice(SG, 1)[0]);
    allCountries.splice(2, 0, allCountries.splice(US, 1)[0]);
  }

  addSocketListeners(io) {
    io.on('connectMe', (event) => {
      this.checkNotifications();
    });
    io.on('message', (event) => {
      this.notificatioMessage.push(event);
    });

    io.on('logout', (event) => {
      let ref;
      if (event.reason === 'Threat Detected') {
        this.destroySession(true);
        ref = this.alertDialog.open(AlertModalComponent, {
          width: '330px',
          height: '240px',
          disableClose: true,
          data: { title: 'Don\'t try anything funny!', message: '', links: null, actions: [{ label: 'I am sorry!', color: 'accent' }] }
        });

      } else {
        this.destroySession(false);
        ref = this.alertDialog.open(AlertModalComponent, {
          width: '330px',
          height: '240px',
          disableClose: true,
          data: { title: event.reason, message: '', links: null, actions: [{ label: 'Close', color: 'accent' }] }
        });
      }
    });

    io.on('ndaStatus', (event) => {
      if (event.status.toLowerCase() === 'completed' && event.handshake.reason === 'POC' && this.apiService.sessionObject.type !== 'supplier') {
        setTimeout(() => {
          this.connectMeService.startPOC({ productID: event.handshake.product, name: '' });
        }, 1500);
      }
    });
  }
  initSocket() {
    if (this.socketHasListeners) {
      return;
    }

    this.socketHasListeners = true;
    if (this.socket.ioSocket.connected) {
      this.addSocketListeners(this.socket);
    } else {
      const io = this.socket.connect();
      io.once('connect', () => {
        this.addSocketListeners(io);
      });

    }

  }


  initEventEmmiterListeners() {
    if (this.eventEmitterService.subsVar === undefined) {
      this.eventEmitterService.subsVar = this.eventEmitterService.
        onRegisterEvent.subscribe((type: string) => {
          switch (type) {
            case 'supplier': {
              this.openUserOnboarding({ token: null, email: '' });
              break;
            }
          }
        });
      this.eventEmitterService.onSupplierOnboardEvent.subscribe((step?: number) => {
        this.openSupplierOnboarding(step);
      });
      this.eventEmitterService.onPocEvent.subscribe(() => {
        this.openPoc();
      });
      this.eventEmitterService.onEditPOCEvent.subscribe((data) => {
        this.openPocEdit(data);
      });
      this.eventEmitterService.onProductOnboardEvent.subscribe((product) => {
        this.openProductOnboarding(product);
      });
      this.eventEmitterService.onOnDocuSignEvent.subscribe((data) => {
        this.openDocuSign(data);
      });
      this.eventEmitterService.onAssesmentEvent.subscribe((data) => {
        this.openAssesment(data);
      });
      this.eventEmitterService.onContactEvent.subscribe((data) => {
        this.openContactModal(data);
      });
      this.eventEmitterService.onLoginEvent.subscribe(() => {
        this.openLoginModal();
      });
      this.eventEmitterService.onConnectMeEvent.subscribe((data) => {
        this.openConnectMe(data);
      });
      this.eventEmitterService.onCheckSessionEvent.subscribe((fromLogin: boolean) => {
        this.onCheckSession(fromLogin);
      });

      this.eventEmitterService.onConnectMeResposneBackEvent.subscribe((data) => {
        this.connectMeResposneBack({ id: data.handshakeID }, data.approved);
      });




    }
  }
  initCookie() {
    if (localStorage.getItem('cookieAccept') !== 'true') {
      setTimeout(() => {
        // return  //// DEV DEV
        this.cookieDialog.open(CookieModalComponent, {
          width: '300px',
          height: '316px',
          disableClose: true
        });
      }, 600);
    }
  }
  initSessionUtils() {
    let checkSession = false;
    let setIntervalCounter = 0;
    const doCheckSession = () => {
      this.checkSession();
      checkSession = false;
      setIntervalCounter = 0;
    };
    setInterval(() => {
      setIntervalCounter += 2;
      if (setIntervalCounter >= 4 || checkSession === true) {
        doCheckSession();
      }
    }, 1000 * 54);

    doCheckSession();

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        if (event.url.indexOf('/join') === 0) {
          this.route.queryParams.subscribe(params => {
            if (params && (params.email || params.token)) {
              const token = params.token;
              const email = params.email;
              this.destroySession(true);
              this.openUserOnboarding({ token, email });
            }
          });
          return;
        }

        if (event.url.indexOf('/upgrade-required') === 0) {
          this.route.queryParams.subscribe(params => {
            this.openSupplierUpgrade();
          });
          return;
        }

        if (event.url === '/portal' || event.id === 1) {
          this.checkOnboardingStatus(this.firstRun);
          this.startVideo();
        } else if (event.url === '/home') {
          // this.startVideo();
        } else {
          this.stopVideo();
        }


        this.firstRun = false;
        checkSession = true;
      }
    });
  }

  startVideo() {
    if (this.videoIsPlaying === true) {
      return;
    }

    document.getElementById('bgvid').style.display = 'block';
    (document.getElementById('bgvid') as any).play();
    this.videoIsPlaying = true;
  }
  stopVideo() {
    if (this.videoIsPlaying === false) {
      return;
    }

    document.getElementById('bgvid').style.display = 'none';
    (document.getElementById('bgvid') as any)?.stop();
    this.videoIsPlaying = false;
  }
  checkNotifications() {
    this.apiService.getConnectMeEvents().subscribe(
      (data: HttpResponse<Object>) => {
        const a = (data.body as any);
        if (a && a.length > 0) {
          this.pushImportantNotification(a[a.length - 1]);
          this.importantNote = true;
        } else {
          this.importantNote = false;
        }
      },
      (respError: Error) => {
      }
    );
  }
  checkMessages() {
    this.apiService.getMessageEvents().subscribe(
      (data: HttpResponse<Object>) => {
        const a = (data.body as any);
        this.notificatioMessage = [];
        for (let i = 0; i < a.length; i++) {
          this.pushMessageNotification(a[i]);
        }

      },
      (respError: Error) => {
      }
    );
  }

  destroySession(doNotRedirect?: boolean) {
    this.apiService.destroySession().subscribe(
      (data: HttpResponse<Object>) => {
        this.socketHasListeners = false;
        this.socket.disconnect();
        if (doNotRedirect !== true) {
          this.router.navigateByUrl('/home');
        }
        this.checkSession();
      },
      (respError: Error) => {
      }
    );
  }
  checkOnboardingStatus(firstRun: boolean) {
    this.apiService.getOnboardingStatus().subscribe(
      (data: HttpResponse<Object>) => {
        this.eventEmitterService.onOnboadDone((data.body as any).status, (data.body as any).hasProduct, firstRun);
        // this.router.navigateByUrl('/onboarding');
      },
      (respError: Error) => {
        // this.loading = false;
      }
    );
  }

  pushMessageNotification(obj: any) {
    this.notificatioMessage.push(obj);
  }

  pushImportantNotification(obj: any) {
    if (this.iHadThat[obj.connectMeID] === true) {
      return;
    }

    this.iHadThat[obj.connectMeID] = true;
    this.importantNoteDetails = {
      id: obj.connectMeID,
      connectMeID: obj.connectMeID,
      isResponse: obj.isResponse,
      from: obj.from,
      reason: obj.reason,
      productID: obj.productID,
      projectID: obj.projectID,
      questionID: obj.questionID,
      answerID: obj.answerID,
      message: obj.message,
      timestamp: obj.timestamp,
      oryginalEvent: obj
    };

    this.importantNote = true;
  }
  onCheckSession(fromLogin) {
    // this.initSocket();
    this.checkSession(fromLogin);
  }
  ///////////
  async checkSession(loggedIn?: boolean) {
    clearTimeout(this.alertTimeout);
    this.apiService.ping().subscribe(
      (data: HttpResponse<Object>) => {
        this.apiService.sessionObject = {
          id: (data.body as any).id,
          hasSession: (data.body as any).status === 'pong',
          details: (data.body as any).details,
          displayName: (data.body as any).displayName,
          company: (data.body as any).company,
          expiresInSeconds: (data.body as any).expiresInSeconds,
          role: (data.body as any).role,
          rapid: (data.body as any).rapid,
          allowComments: (data.body as any).allowComments,
          allowUseCases: (data.body as any).allowUseCases,
          zeroTrialFee: (data.body as any).zeroTrialFee,
          requireNDA: (data.body as any).requireNDA,
          status: (data.body as any).status,
          type: (data.body as any).type,
          membership: (data.body as any).membership,
          permissions: (data.body as any).permissions,
          level: (data.body as any).level,
          domain: (data.body as any).domain
        };
        this.checkNotifications();
        this.checkMessages();
        if (loggedIn === true && this.apiService.sessionObject.hasSession === true) {
          if (this.apiService.sessionObject.type === 'portalAdmin') {
            if (this.apiService.sessionObject.role === 'superadmin') {
              this.router.navigateByUrl('/admin/superuser');
            } else {
              this.router.navigateByUrl('/admin');
            }
          } else {
            window.location.href = '/portal';
          }
        }
        this.eventEmitterService.onSessionChecked(this.apiService.sessionObject.hasSession);
        this.initSocket();
        const expiresInSeconds: number = this.apiService.sessionObject.expiresInSeconds;
        if (expiresInSeconds) {
          if (expiresInSeconds <= 120) {
            const lastClick = Math.floor((new Date().getTime() - lastClickTimeStamp) / 1000);
            if (lastClick < 120) {
              this.apiService.renewSession().subscribe((data: HttpResponse<Object>) => {
              }, (respError: Error) => {

              });
              return;
            }
          }
          if (expiresInSeconds < 61) {
            this.openSessionAlert(expiresInSeconds);
          } else {
            const inSeconds = (-60 + expiresInSeconds);
            this.alertTimeout = setTimeout(() => {
              this.openSessionAlert(60);
            }, inSeconds * 1000);
          }
        }
      },
      (respError: any) => {
        if (respError.status !== 401) {
          return;
        }

        this.apiService.sessionObject = {
          id: null,
          hasSession: false,
          details: null,
          displayName: null,
          company: null,
          expiresInSeconds: 0,
          role: null,
          rapid: false,
          allowComments: true,
          allowUseCases: true,
          zeroTrialFee: false,
          requireNDA: true,
          level: 0,
          status: null,
          type: null,
          membership: null,
          permissions: [],
          domain: null
        };
        this.eventEmitterService.onSessionChecked(this.apiService.sessionObject.hasSession);
        this.socket.disconnect();
      }
    );
  }




  /// MODALS
  openLoginModal(): void {
    this.loginDialog.open(LoginModalComponent, {
      width: '410px',
      height: '342px',
      disableClose: true
    });
  }
  openMembershipModal() {
    this.contactDialog.open(MembershipModalComponent, {
      width: '43vw',
      height: '58vh',
      maxWidth: undefined,
      disableClose: false
    });
  }
  openProfileModal() {
    this.contactDialog.open(ProfileModalComponent, {
      width: '43vw',
      height: '58vh',
      maxWidth: undefined,
      disableClose: false
    });
  }

  openContactModal(subject?: string): void {
    this.contactDialog.open(ContactModalComponent, {
      width: '43vw',
      height: '59vh',
      maxWidth: undefined,
      disableClose: false,
      data: { subject }
    });
  }
  openUserOnboarding(data?: Object): void {
    this.registerDialog.open(UserOnboardingModalComponent, {
      // width: '70vw',
      // height: '80vh',
      width: '89vw',
      height: '89vh',
      maxWidth: undefined,
      disableClose: true,
      data
    });
  }
  openSupplierUpgrade(): void {
    this.registerDialog.open(SupplierUpgradeModalComponent, {
      // width: '70vw',
      // height: '80vh',
      width: '89vw',
      height: '89vh',
      maxWidth: undefined,
      disableClose: true
    });
  }
  openPoc(): void {
    this.registerDialog.open(PocModalComponent, {
      width: '85vw',
      height: '85vh',
      maxWidth: undefined,
      disableClose: true
      // data: { name: "this.name", color: "this.color" }
    });
  }
  openPocEdit(project): void {
    const ref = this.registerDialog.open(ReviewDialogComponent, {
      width: '92vw',
      height: '87vh',
      maxWidth: undefined,
      disableClose: false,
      panelClass: 'review-dialog',
      data: {
        project
      }
    });
    ref.addPanelClass('review-dialog');
    ref.afterClosed().subscribe(result => {
      this.eventEmitterService.onUpdatePOCList();
    });
  }
  openSupplierOnboarding(step?: number): void {
    this.onboadringDialog.open(SupplierOnboardingModalComponent, {
      width: '93vw',
      height: '94vh',
      maxWidth: undefined,
      disableClose: true,
      data: { step }
    });
  }
  openProductOnboarding(product): void {
    const ref = this.onboadringDialog.open(ProductOnboardingModalComponent, {
      width: '89vw',
      height: '89vh',
      maxWidth: undefined,
      disableClose: true,
      data: product
    });
    ref.afterClosed().subscribe(result => {
      this.checkOnboardingStatus(false);
    });
  }
  openDocuSign(data: any) {
    const ref = this.docuSignDialog.open(DocuSignComponent, {
      width: '80vw',
      height: '87vh',
      maxWidth: undefined,
      disableClose: true,
      panelClass: 'termsDialogModal',
      data
    });
    ref.afterClosed().subscribe(result => {
      //  this.insuranceFormGroup.patchValue({understood: true});
    });
    this.socket.once('termsSigned', (event) => {
      if (ref) {
        ref.close();
      }
    });
  }
  openAssesment(product): void {
    this.contactDialog.open(AssessmentComponent, {
      width: '84vw',
      height: '89vh',
      maxWidth: undefined,
      disableClose: false,
      data: product
    });
  }
  openConnectMe(data): void {
    this.connectMeDialog.open(ConnectMeModalComponent, {
      width: '550px',
      height: '255px',
      minHeight: '165px',
      maxWidth: undefined,
      disableClose: false,
      data
    });
  }
  openSessionAlert(expiresInSeconds: number): void {
    if (this.openSessionDialogRef !== undefined) {
      return;
    }
    this.openSessionDialogRef = this.sessionDialog.open(ExpireAlertComponent, {
      width: '40vw',
      height: '34vh',
      maxWidth: undefined,
      maxHeight: '245px',
      disableClose: true,
      data: { expiresInSeconds }
    });
    this.openSessionDialogRef.afterClosed().subscribe(result => {
      this.openSessionDialogRef = undefined;
    });

    this.logoutTimeout = setTimeout(() => {
      this.checkSession();
    }, (expiresInSeconds + 1) * 1000);
  }
  openReview(title, question): void {
    const ref = this.registerDialog.open(ReviewDialogComponent, {
      width: '80vw',
      height: '90vh',
      maxWidth: undefined,
      disableClose: false,
      panelClass: 'review-dialog',
      data: {
        projectTitle: title,
        question
      }
    });
    ref.addPanelClass('review-dialog');
  }
  removeMessage(msg): void {
    this.apiService.hideMessage(msg._id).subscribe(
      (data: HttpResponse<Object>) => {
        this.notificatioMessage = this.notificatioMessage.filter(obj => obj._id !== msg._id);
      },
      (respError: Error) => {
      }
    );
  }
}
