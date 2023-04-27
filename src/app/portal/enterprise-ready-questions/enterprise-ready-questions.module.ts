import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnterpriseReadyQuestionsDashboardComponent } from './enterprise-ready-questions-dashboard.component';
import { ProgressBadgeComponent } from './components/progress-badge/progress-badge.component';
import { StepActionButtonsComponent } from './components/step-action-buttons/step-action-buttons.component';

import { CertificationComponent } from './components/certification/certification.component';
import { BreachNotificationComponent } from './components/breach-notification/breach-notification.component';
import { SsdlcComponent } from './components/ssdlc/ssdlc.component';
import { ApplicationSecurityComponent } from './components/application-security/application-security.component';
import { DataDeletionRetentionComponent } from './components/data-deletion-retention/data-deletion-retention.component';
import { DataPrivacyComponent } from './components/data-privacy/data-privacy.component';
import { DisasterRecoveryComponent } from './components/disaster-recovery/disaster-recovery.component';
import { EncryptionComponent } from './components/encryption/encryption.component';
import { DataStorageSeparationComponent } from './components/data-storage-separation/data-storage-separation.component';
import * as fromERQStore from './store';
import { ERQEffects } from './store/index.effects';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HelpContentComponent } from './components/help-content/help-content.component';
import { ProgressChartComponent } from './components/progress-chart/progress-chart.component';
import { ErqOverviewComponent } from './components/erq-overview/erq-overview.component';
import { CompliantBadgeComponent } from './components/compliant-badge/compliant-badge.component';

const effects = [
  ERQEffects
];


@NgModule({
  declarations: [
    EnterpriseReadyQuestionsDashboardComponent,
    ProgressBadgeComponent,
    StepActionButtonsComponent,
    CertificationComponent,
    BreachNotificationComponent,
    SsdlcComponent,
    ApplicationSecurityComponent,
    DataDeletionRetentionComponent,
    DataPrivacyComponent,
    DataStorageSeparationComponent,
    DisasterRecoveryComponent,
    EncryptionComponent,
    HelpContentComponent,
    ProgressChartComponent,
    ErqOverviewComponent,
    CompliantBadgeComponent,
  ],
  providers: [fromERQStore.reducerProvider],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatTooltipModule,
    SharedModule,
    StoreModule.forFeature(
      fromERQStore.ERQFeatureKey,
      fromERQStore.REDUCERS_TOKEN,
      {
        metaReducers: fromERQStore.metaReducers
      }),
    EffectsModule.forFeature(effects)
  ],
  exports: [
    EnterpriseReadyQuestionsDashboardComponent,
    ProgressBadgeComponent,
    CompliantBadgeComponent,
    StepActionButtonsComponent,
    CertificationComponent,
    BreachNotificationComponent,
    SsdlcComponent,
    ApplicationSecurityComponent,
    DataDeletionRetentionComponent,
    DataPrivacyComponent,
    DataStorageSeparationComponent,
    DisasterRecoveryComponent,
    EncryptionComponent,
    ProgressChartComponent,
    ErqOverviewComponent,
  ]
})
export class EnterpriseReadyQuestionsModule { }
