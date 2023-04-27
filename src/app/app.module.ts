import { NgModule, LOCALE_ID } from '@angular/core';
import { SocketIoModule } from 'ngx-socket-io';
import { ioConfig } from '@constants/io.constant';
import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import localeGb from '@angular/common/locales/en-GB';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeGb, 'en-GB');

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './+home-page/home.component';
import { AboutPageComponent } from './+about-page/about.component';
import { SharedModule } from '@shared/shared.module';
import { PortalModule } from './portal/portal.module';
import { environment } from 'src/environments/environment';
import { AdminModule } from './admin/admin.module';
import { reducers, metaReducers } from './store';
import { AppEffects } from './store/app.effects';
import { OnboardingModule } from './onboarding/onboarding.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { FeedbackModule } from './feedback/feedback.module';
import { InviteSupplierComponentComponent } from './invite-supplier-component/invite-supplier-component.component';
import { SupplierUpgradeModalComponent } from './supplier-upgrade-modal/supplier-upgrade-modal.component';
import { AuthModule } from '@auth0/auth0-angular';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthHttpInterceptor } from '@auth0/auth0-angular';
import { environment as env } from '../environments/environment';

import { AuthService } from '@auth0/auth0-angular';
import { JoinPageComponent } from './join-page/join-page.component';
import { BasicDetailsFormComponent } from './join-page/components/basic-details-form/basic-details-form.component';
import { MoreDetailsFormComponent } from './join-page/components/more-details-form/more-details-form.component';
import { VerificationFormComponent } from './join-page/components/verification-form/verification-form.component';
import { SliderComponentComponent } from './join-page/components/slider-component/slider-component.component';

import { NgxDropzoneModule } from 'ngx-dropzone';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KeysPipe } from '@pipes/keys-pipe/keys-pipe.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    AboutPageComponent,
    InviteSupplierComponentComponent,
    SupplierUpgradeModalComponent,
    JoinPageComponent,
    BasicDetailsFormComponent,
    MoreDetailsFormComponent,
    VerificationFormComponent,
    SliderComponentComponent,
    KeysPipe
  ],
  providers: [
    AuthService,
    { provide: LOCALE_ID, useValue: 'en-US' },
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.recaptchaSiteKey },
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
    KeysPipe
  ],
  imports: [
    SharedModule,
    PortalModule,
    AdminModule,
    FeedbackModule,
    OnboardingModule,
    DashboardModule,
    AppRoutingModule,
    RecaptchaV3Module,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MatIconModule,
    MatFormFieldModule,
    MatGridListModule,
    SocketIoModule.forRoot(ioConfig),
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      }
    }),
    StoreDevtoolsModule.instrument(),
    // !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([AppEffects]),
    AuthModule.forRoot({
      ...env.auth,
      httpInterceptor: {
        allowedList: [`${env.serverUrl}/api/v1/user/login/sso`],
      },
    }),
    NgxDropzoneModule,
    MarketplaceModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
