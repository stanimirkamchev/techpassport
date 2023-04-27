import { NgModule } from '@angular/core';

import { PortalPageComponent } from './+portal-page/portal.component';
import { SharedModule } from '@shared/shared.module';
import { DashboardPageComponent } from './+dashboard-page/dashboard.component';
import { TeamPageComponent } from './+team-page/team.component';
import { CustomerPageComponent } from './+customer-page/customer.component';
import { InformationSecurity } from './assessment-modal/guidence/informationSecurity.component';
import { BusinessContinuity } from './assessment-modal/guidence/businessContinuity.component';
import { AntiMoneyLaundering } from './assessment-modal/guidence/antiMoneyLaundering.component';
import { Sanctions } from './assessment-modal/guidence/sanctions.component';
import { AntiBribery } from './assessment-modal/guidence/antiBribery.component';
import { SupplyChain } from './assessment-modal/guidence/supplyChain.component';
import { RecordsManagement } from './assessment-modal/guidence/recordsManagement.component';
import { WhistleBlowing } from './assessment-modal/guidence/whistleBlowing.component';
import { DashboardModule } from '../dashboard/dashboard.module';

const components = [
  PortalPageComponent,
  DashboardPageComponent,
  TeamPageComponent,
  CustomerPageComponent,
  InformationSecurity,
  BusinessContinuity,
  AntiMoneyLaundering,
  Sanctions,
  AntiBribery,
  SupplyChain,
  RecordsManagement,
  WhistleBlowing,
  // InvitationPanelPageComponent,
  // SnackBarCustomComponent
];

import { AddTeamMemberComponent } from './add-team-member-modal/add-team-member.component';
import { AddBusinessGroupComponent } from './add-business-group-component/add-business-group-component.component';
import { PocModalComponent } from './poc-modal/poc-modal.component';
import { PocMenuComponent } from './poc-modal/poc-menu/poc-menu.component';
import { PocTeamManagerComponent } from './poc-modal/poc-team-manager/poc-team-manager.component';
import { AssessmentComponent } from './assessment-modal/assessment.component';
import { ComplianceModalComponent } from './compliance-modal/compliance-modal.component';
import { ConnectMeModalComponent } from './connectme-modal/connectme-modal.component';
import { ContractModalComponent } from './contract-modal/contract-modal.component';
import { ContactModalComponent } from './contact-modal/contact-modal.component';
import { OuterMarketModule } from './+outer-market-page/outerMarket.module';
import { InviteSuppliersModule } from '../invite-suppliers-module/invite-suppliers.module';
import { InviteModalComponent } from './invite-modal/invite-modal.component';
import { FilterModalComponent as PortalFilterModalComponent } from './filter-modal/filter-modal.component';
import { CheckboxesComponent } from './filter-modal/partials/checkboxes/checkboxes.component';
import { SelectMinMaxComponent } from './filter-modal/partials/select-min-max/select-min-max.component';
import { SelectMinMaxDateComponent } from './filter-modal/partials/select-min-max-date/select-min-max-date.component';
import { OnBoardModalComponent } from './on-board-modal/on-board-modal.component';
import { DisabledUserPortalComponent } from './disabled-user-portal/disabled-user-portal.component';
import { AutocompleteMinMaxComponent } from './filter-modal/partials/autocomplete-min-max/autocomplete-min-max.component';
import { PlansModalComponent } from './plans-modal/plans-modal.component';
import { UpdateUserTablePortalComponent } from './update-user-table-portal/update-user-table-portal.component';
import { TaxonomyUserTablePortalComponent } from './taxonomy-user-table-portal/taxonomy-user-table-portal.component';
import { DeleteUserTablePortalComponent } from './delete-user-table-portal/delete-user-table-portal.component';
import { AlertsModalComponent } from './alerts-modal/alerts-modal.component';
import { InviteModalNewComponent } from './invite-modal-new/invite-modal-new.component';
import { ProductModalComponent } from './product-modal/product-modal.component';
import { EnterpriseReadyQuestionsModule } from './enterprise-ready-questions/enterprise-ready-questions.module';
import { ProductBasicDetailsComponent } from './product-modal/partials/product-basic-details/product-basic-details.component';
import { ProductAccordionPanelComponent } from './product-modal/partials/product-accordion-panel/product-accordion-panel.component';
import { ProductActionButtonsComponent } from './product-modal/partials/product-action-buttons/product-action-buttons.component';
import { VideoModalComponent } from './video-modal/video-modal.component';
import { DetailsProductItemComponent } from './product-modal/partials/product-accordion-panel/details-product-item/details-product-item.component';
import { DetailsProductFunctionalityComponent } from './product-modal/partials/product-accordion-panel/details-product-item/details-product-functionality/details-product-functionality.component';
import { DetailsProductDataAccessComponent } from './product-modal/partials/product-accordion-panel/details-product-item/details-product-data-access/details-product-data-access.component';
import { DetailsProductHostingComponent } from './product-modal/partials/product-accordion-panel/details-product-item/details-product-hosting/details-product-hosting.component';
import { DetailsProductChargesComponent } from './product-modal/partials/product-accordion-panel/details-product-item/details-product-charges/details-product-charges.component';
import { DetailsProductSoftwareComponent } from './product-modal/partials/product-accordion-panel/details-product-item/details-product-software/details-product-software.component';
import { DetailsProductUsecaseComponent } from './product-modal/partials/product-accordion-panel/details-product-item/details-product-usecase/details-product-usecase.component';
import { ErqProductItemComponent } from './product-modal/partials/product-accordion-panel/erq-product-item/erq-product-item.component';
import { ErqProductCertificationComponent } from './product-modal/partials/product-accordion-panel/erq-product-item/erq-product-certification/erq-product-certification.component';
import { ErqProductBreachComponent } from './product-modal/partials/product-accordion-panel/erq-product-item/erq-product-breach/erq-product-breach.component';
import { ErqProductSsdlcComponent } from './product-modal/partials/product-accordion-panel/erq-product-item/erq-product-ssdlc/erq-product-ssdlc.component';
import { ErqProductSecurityComponent } from './product-modal/partials/product-accordion-panel/erq-product-item/erq-product-security/erq-product-security.component';
import { ErqProductDeletionComponent } from './product-modal/partials/product-accordion-panel/erq-product-item/erq-product-deletion/erq-product-deletion.component';
// tslint:disable-next-line:max-line-length
import { ErqProductPrivacyComponent } from './product-modal/partials/product-accordion-panel/erq-product-item/erq-product-privacy/erq-product-privacy.component';
// tslint:disable-next-line:max-line-length
import { ErqProductStorageComponent } from './product-modal/partials/product-accordion-panel/erq-product-item/erq-product-storage/erq-product-storage.component';
import { ErqProductRecoveryComponent } from './product-modal/partials/product-accordion-panel/erq-product-item/erq-product-recovery/erq-product-recovery.component';
import { ErqProductEncryptionComponent } from './product-modal/partials/product-accordion-panel/erq-product-item/erq-product-encryption/erq-product-encryption.component';
import { MarketplaceModule } from '../marketplace/marketplace.module';
import { FisworkedComponent } from './product-modal/partials/product-accordion-panel/fisworked/fisworked.component';
import { CompanyDetailsComponent } from './product-modal/partials/product-accordion-panel/company-details/company-details.component';
import { CompanyDiversityComponent } from './product-modal/partials/product-accordion-panel/company-diversity/company-diversity.component';
import { InsuranceComponent } from './product-modal/partials/product-accordion-panel/insurance/insurance.component';
import { PortalRoutingModule } from './portal-routing.module';
import { OnboardingModule } from '../onboarding/onboarding.module';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { WatchlistFilterComponent } from './watchlist/partials/watchlist-filter/watchlist-filter.component';
import { MyWatchlistsComponent } from './watchlist/partials/my-watchlists/my-watchlists.component';
import { CompanyWatchlistsComponent } from './watchlist/partials/company-watchlists/company-watchlists.component';
import { WatchlistDetailComponent } from './watchlist/partials/watchlist-detail/watchlist-detail.component';
import { RemoveWatchlistsModalComponent } from './watchlist/partials/remove-watchlists-modal/remove-watchlists-modal.component';
import { EditWatchlistModalComponent } from './watchlist/partials/edit-watchlist-modal/edit-watchlist-modal.component';
import { LeaveWatchlistModalComponent } from './watchlist/partials/leave-watchlist-modal/leave-watchlist-modal.component';
import { DeleteWatchlistModalComponent } from './watchlist/partials/delete-watchlist-modal/delete-watchlist-modal.component';
import { CreateWatchlistModalComponent } from './watchlist/partials/create-watchlist-modal/create-watchlist-modal.component';
import { InviteWatchlistModalComponent } from './watchlist/partials/invite-watchlist-modal/invite-watchlist-modal.component';
import { CreateSuccessModalComponent } from './watchlist/partials/create-success-modal/create-success-modal.component';
import { InviteSentModalComponent } from './watchlist/partials/invite-sent-modal/invite-sent-modal.component';

const modals = [
  AddTeamMemberComponent,
  AddBusinessGroupComponent,
  PocModalComponent,
  PocMenuComponent,
  PocTeamManagerComponent,
  AssessmentComponent,
  ComplianceModalComponent,
  ConnectMeModalComponent,
  ContactModalComponent,
  ContractModalComponent,
  InviteModalComponent,
  PortalFilterModalComponent,
  PlansModalComponent
];

@NgModule({
  imports: [
    SharedModule,
    DashboardModule,
    OuterMarketModule,
    InviteSuppliersModule,
    EnterpriseReadyQuestionsModule,
    MarketplaceModule,
    // PortalRoutingModule,
    OnboardingModule
  ],

  declarations: [
    ...components,
    ...modals,
    CheckboxesComponent,
    SelectMinMaxComponent,
    SelectMinMaxDateComponent,
    OnBoardModalComponent,
    DisabledUserPortalComponent,
    AutocompleteMinMaxComponent,
    UpdateUserTablePortalComponent,
    TaxonomyUserTablePortalComponent,
    DeleteUserTablePortalComponent,
    AlertsModalComponent,
    InviteModalNewComponent,
    ProductModalComponent,
    ProductBasicDetailsComponent,
    ProductAccordionPanelComponent,
    ProductActionButtonsComponent,
    VideoModalComponent,
    DetailsProductItemComponent,
    DetailsProductFunctionalityComponent,
    DetailsProductDataAccessComponent,
    DetailsProductHostingComponent,
    DetailsProductChargesComponent,
    DetailsProductSoftwareComponent,
    DetailsProductUsecaseComponent,
    ErqProductItemComponent,
    ErqProductCertificationComponent,
    ErqProductBreachComponent,
    ErqProductSsdlcComponent,
    ErqProductSecurityComponent,
    ErqProductDeletionComponent,
    ErqProductPrivacyComponent,
    ErqProductStorageComponent,
    ErqProductRecoveryComponent,
    ErqProductEncryptionComponent,
    FisworkedComponent,
    CompanyDetailsComponent,
    CompanyDiversityComponent,
    InsuranceComponent,
    WatchlistComponent,
    WatchlistFilterComponent,
    MyWatchlistsComponent,
    CompanyWatchlistsComponent,
    WatchlistDetailComponent,
    RemoveWatchlistsModalComponent,
    EditWatchlistModalComponent,
    LeaveWatchlistModalComponent,
    DeleteWatchlistModalComponent,
    CreateWatchlistModalComponent,
    InviteWatchlistModalComponent,
    CreateSuccessModalComponent,
    InviteSentModalComponent
  ],
  entryComponents: [
    ...modals
  ],
  exports: [
    ...components,
    ...modals,
    MyWatchlistsComponent
  ]
})
export class PortalModule { }
