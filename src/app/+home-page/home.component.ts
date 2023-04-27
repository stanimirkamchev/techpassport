import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserTypeModalComponent } from '@shared/modals/user-type-modal/user-type-modal.component';
import { HowtoModalComponent } from '@shared/modals/howto-modal/howto-modal.component';
import { AlertModalComponent } from '@shared/modals/alert-modal/alert-modal.component';
import { EventEmitterService } from '../common/services/event-emitter/event-emitter.service';
import { ApiService } from '@services/api/api.service';
import { AuthService } from '@auth0/auth0-angular';
import { delay, map, switchMap, take, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { VersionProviderService } from '../common/services/version-provider/version-provider.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomePageComponent implements OnInit {
  constructor(
    public auth: AuthService,
    private router: Router,
    private joinTypeDialog: MatDialog,
    private alertDialog: MatDialog,
    private eventEmitterService: EventEmitterService,
    private apiService: ApiService
  ) {
  }

  loading = false;
  version = VersionProviderService.getVersion();

  ngOnInit(): void {
    this.auth.user$
      .pipe(take(1))
      .pipe(tap((user => {
        if (user) {
          this.loading = true;
        }
        return user;
      })))
      .pipe(
        switchMap((user: any) => {
          if (user) {
            return this.apiService.loginSSO(user);
          }
          return of(null);
        })
      )
      .pipe(take(1))
      .pipe(delay(1500))
      .subscribe((result: HttpResponse<any>) => {
        if (result && result.ok) {
          // setTimeout(() => {
          this.router.navigateByUrl('/portal');
          this.eventEmitterService.onLoggedin();
          // }, 200);
        }
        return;
      },
        error => {
          if (error) {
            this.alertDialog.open(AlertModalComponent, {
              width: '360px',
              height: '220px',
              disableClose: true,
              data: {
                title: `You are not authorized!`,
                message: '',
                actions: [{ label: 'Close', color: 'primary' }],
                links: [],
                progress: false,
                ssoLoginAttempt: true
              },
            });
            setTimeout(() => {
              this.auth.logout();
            }, 4000);
          }
        });
  }
  howTo(): void {
    this.joinTypeDialog.open(HowtoModalComponent, {
      width: '92vw',
      height: '90vh',
      maxWidth: undefined,
    });
  }
  joinUs(): void {
    this.joinTypeDialog.open(UserTypeModalComponent, {
      width: '370px',
      height: 'auto'
    });
  }
  logIn(): void {
    this.eventEmitterService.onLogin();
  }
  auth0LogIn(): void {
    this.auth.loginWithRedirect({
      screen_hint: 'login',
      appState: {
        target: window.location.pathname
      }
    });
  }
  pocModal(): void {
    this.eventEmitterService.onPoc();
  }
}
