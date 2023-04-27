import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgxDropzoneModule } from 'ngx-dropzone';

import * as fromOnboarding from './store';

import { BuyerEffects } from './store/buyer/buyer.effects';

const effects = [BuyerEffects];

import { BuyerOnboardingModalComponent } from './buyer-onboarding-modal/buyer-onboarding-modal.component';
import { CompanyOnboardingModalComponent } from './company-onboarding-modal/company-onboarding-modal.component';
import { ProductDeletionModalComponent } from './product-deletion-modal/product-deletion-modal.component';

const modals = [
  BuyerOnboardingModalComponent,
  CompanyOnboardingModalComponent,
  ProductDeletionModalComponent
];

import { BuyerEntityStepComponent } from './buyer-onboarding-stepper/buyer-entity-step/buyer-entity-step.component';
import { BuyerInvoicesStepComponent } from './buyer-onboarding-stepper/buyer-invoices-step/buyer-invoices-step.component';
import { BuyerGroupCompanyStepComponent } from './buyer-onboarding-stepper/buyer-group-company-step/buyer-group-company-step.component';
import { BuyerDummyDataStepComponent } from './buyer-onboarding-stepper/buyer-dummy-data-step/buyer-dummy-data-step.component';
import { BuyerSamlStepComponent } from './buyer-onboarding-stepper/buyer-saml-step/buyer-saml-step.component';
import { BuyerSanctionsStepComponent } from './buyer-onboarding-stepper/buyer-sanctions-step/buyer-sanctions-step.component';
import { BuyerInviteStepComponent } from './buyer-onboarding-stepper/buyer-invite-step/buyer-invite-step.component';
import { BuyerOnboardingStepperComponent } from './buyer-onboarding-stepper/buyer-onboarding-stepper.component';
import { CompanyOnboardingStepperComponent } from './company-onboarding-stepper/company-onboarding-stepper.component';
import { BuyerSettingsStepComponent } from './buyer-onboarding-stepper/buyer-settings-step/buyer-settings-step.component';
import { OnboardingLayoutComponent } from './onboarding-layout/onboarding-layout.component';
import { OnboardingRoutingModule } from './onboarding-routing.module';
import { OnboardingStartupComponent } from './onboarding-startup/onboarding-startup.component';
import { PersonalSettingsComponent } from './personal-settings/personal-settings.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { CompanySettingsComponent } from './company-settings/company-settings.component';
import { CompanyInsuranceComponent } from './company-insurance/company-insurance.component';
import { InviteUsersComponent } from './components/invite-users/invite-users.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { FileDropzoneComponent } from './components/file-dropzone/file-dropzone.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { CustomDatepickerComponent } from './components/custom-datepicker/custom-datepicker.component';
import { CustomCheckboxComponent } from './components/custom-checkbox/custom-checkbox.component';
import { CustomMultiCheckboxComponent } from './components/custom-multi-checkbox/custom-multi-checkbox.component';
import { ProductSettingsComponent } from './product-settings/product-settings.component';
import { CustomTextareaComponent } from './components/custom-textarea/custom-textarea.component';
import { MembershipComponent } from './membership/membership.component';
import { CorePlanComponent } from './components/core-plan/core-plan.component';
import { PremiumPlanComponent } from './components/premium-plan/premium-plan.component';
import { MembershipFileDropzoneComponent } from './components/membership-file-dropzone/membership-file-dropzone.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { CustomButtonComponent } from './components/custom-button/custom-button.component';
import { CustomSelectComponent } from './components/custom-select/custom-select.component';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import { AuditingExperienceComponent } from './components/auditing-experience/auditing-experience.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductVideoComponent } from './product-settings/product-video/product-video.component';
import { ProductCollateralComponent } from './product-settings/product-collateral/product-collateral.component';
import { ProductHostingComponent } from './product-settings/product-hosting/product-hosting.component';
import { ApplicationSoftwareComponent } from './product-settings/application-software/application-software.component';
import { DataAccessComponent } from './product-settings/data-access/data-access.component';
import { UseCasesComponent } from './product-settings/use-cases/use-cases.component';
import { ProductChargesComponent } from './product-settings/product-charges/product-charges.component';
import { AddSolutionModalComponent } from './product-settings/add-solution-modal/add-solution-modal.component';
import { AddFrameworkModalComponent } from './product-settings/add-framework-modal/add-framework-modal.component';
import { AddTagModalComponent } from './product-settings/add-tag-modal/add-tag-modal.component';
import { FormTracker } from './form-tracker';
import { TagsInputComponent } from './product-settings/tags-input/tags-input.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

const components = [
  BuyerEntityStepComponent,
  BuyerSettingsStepComponent,
  BuyerInvoicesStepComponent,
  BuyerGroupCompanyStepComponent,
  BuyerDummyDataStepComponent,
  BuyerSanctionsStepComponent,
  BuyerSamlStepComponent,
  BuyerInviteStepComponent,
  BuyerOnboardingStepperComponent,
  CompanyOnboardingStepperComponent,
  OnboardingLayoutComponent,
  OnboardingStartupComponent,
  TopBarComponent,
  TabsComponent,
  PersonalSettingsComponent,
  CompanySettingsComponent,
  InviteUsersComponent,
  PageHeaderComponent,
  FileDropzoneComponent,
  CustomInputComponent,
  CustomDatepickerComponent,
  CustomCheckboxComponent,
  CustomMultiCheckboxComponent,
  ProductSettingsComponent,
  CustomTextareaComponent,
  ChangePasswordComponent,
  CustomButtonComponent,
  CustomSelectComponent,
  ProfileSettingsComponent,
  AuditingExperienceComponent,
  ProductsListComponent,
  ProductVideoComponent,
  ProductCollateralComponent,
  ProductHostingComponent,
  ApplicationSoftwareComponent,
  DataAccessComponent,
  UseCasesComponent,
  ProductChargesComponent,
  TagsInputComponent
];

@NgModule({
  imports: [
    SharedModule,
    OnboardingRoutingModule,
    StoreModule.forFeature(
      fromOnboarding.onboardingFeatureKey,
      fromOnboarding.REDUCERS_TOKEN,
      { metaReducers: fromOnboarding.metaReducers }),
    EffectsModule.forFeature(effects),
    NgxDropzoneModule,
    MatSlideToggleModule
  ],
  providers: [fromOnboarding.reducerProvider, FormTracker],
  declarations: [
    ...components,
    ...modals,
    MembershipComponent,
    CorePlanComponent,
    PremiumPlanComponent,
    MembershipFileDropzoneComponent,
    AddSolutionModalComponent,
    AddFrameworkModalComponent,
    CompanyInsuranceComponent,
    AddTagModalComponent,
  ],
  entryComponents: [
    ...modals
  ],
  exports: [
    CustomCheckboxComponent,
    CustomTextareaComponent,
    TagsInputComponent,
    OnboardingLayoutComponent
  ]
})
export class OnboardingModule { }
