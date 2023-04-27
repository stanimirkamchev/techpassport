import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import * as fromAdmin from './store';
import { EffectsModule } from '@ngrx/effects';

import { ComplianceEffects } from './store/compliance/compliance.effects';
import { ProductEffects } from './store/product/product.effects';
import { SupplierEffects } from './store/supplier/supplier.effects';
import { SuperuserEffects } from './store/superuser/superuser.effects';
import { CustomerEffects } from './store/customer/customer.effects';
import { EditTablesEffects } from './store/editTables/editTables.effects';

const effects = [
  ComplianceEffects,
  ProductEffects,
  SupplierEffects,
  SuperuserEffects,
  CustomerEffects,
  EditTablesEffects
];

import { AdminPageComponent } from './+admin-page/admin-page.component';
import { CompliancePageComponent } from './+admin-page/+compliance-page/compliance-page.component';
import { ProductsPageComponent } from './+admin-page/+products-page/products-page.component';
import { SuppliersPageComponent } from './+admin-page/+suppliers-page/suppliers-page.component';
import { ComplianceDetailsPageComponent } from './+admin-page/+compliance-page/+compliance-details-page/compliance-details-page.component';
import { ProductDetailsPageComponent } from './+admin-page/+products-page/+product-details-page/product-details-page.component';
import { SupplierDetailsPageComponent } from './+admin-page/+suppliers-page/+supplier-details-page/supplier-details-page.component';
import { AdminDrawerComponent } from './admin-drawer/admin-drawer.component';
import { ComplianceTableComponent } from './+admin-page/+compliance-page/compliance-table/compliance-table.component';
import { ComplianceFiltersComponent } from './+admin-page/+compliance-page/compliance-filters/compliance-filters.component';
import { SuppliersTableComponent } from './+admin-page/+suppliers-page/suppliers-table/suppliers-table.component';
import { SuppliersFiltersComponent } from './+admin-page/+suppliers-page/suppliers-filters/suppliers-filters.component';
import { ProductsTableComponent } from './+admin-page/+products-page/products-table/products-table.component';
import { ProductsFiltersComponent } from './+admin-page/+products-page/products-filters/products-filters.component';
import { ProductHeaderComponent } from './+admin-page/+products-page/product-header/product-header.component';
import { HeaderControlsComponent } from './header-controls/header-controls.component';
import { ApprovalStatusComponent } from './approval-status/approval-status.component';
import { RejectionStatusComponent } from './rejection-status/rejection-status.component';
import { SuperuserPageComponent } from './+admin-page/+superuser-page/superuser-page.component';
import { AccessManagementTableComponent } from './+admin-page/+superuser-page/access-management-table/access-management-table.component';
import { ErrorHandlingTableComponent } from './+admin-page/+superuser-page/error-handling-table/error-handling-table.component';
import { AccessLogTableComponent } from './+admin-page/+superuser-page/access-log-table/access-log-table.component';
import { ErrorHandlingFiltersComponent } from './+admin-page/+superuser-page/error-handling-filters/error-handling-filters.component';
import { BanksPageComponent } from './+admin-page/+banks-page/banks-page.component';
import { BanksTableComponent } from './+admin-page/+banks-page/banks-table/banks-table.component';
import { BanksFiltersComponent } from './+admin-page/+banks-page/banks-filters/banks-filters.component';
// tslint:disable
import { SupplierReviewPageComponent } from './+admin-page/+suppliers-page/+supplier-details-page/+supplier-review-page/supplier-review-page.component';
import { SupplierProductsPageComponent } from './+admin-page/+suppliers-page/+supplier-details-page/+supplier-products-page/supplier-products-page.component';
import { SupplierCompliancePageComponent } from './+admin-page/+suppliers-page/+supplier-details-page/+supplier-compliance-page/supplier-compliance-page.component';
import { ProductSupplierPageComponent } from './+admin-page/+products-page/+product-details-page/+product-supplier-page/product-supplier-page.component';
import { ProductReviewPageComponent } from './+admin-page/+products-page/+product-details-page/+product-review-page/product-review-page.component';
import { ProductCompliancePageComponent } from './+admin-page/+products-page/+product-details-page/+product-compliance-page/product-compliance-page.component';
import { ComplianceSupplierPageComponent } from './+admin-page/+compliance-page/+compliance-details-page/+compliance-supplier-page/compliance-supplier-page.component';
import { ComplianceProductPageComponent } from './+admin-page/+compliance-page/+compliance-details-page/+compliance-product-page/compliance-product-page.component';
import { ComplianceReviewPageComponent } from './+admin-page/+compliance-page/+compliance-details-page/+compliance-review-page/compliance-review-page.component';
import { AccessManagementFiltersComponent } from './+admin-page/+superuser-page/access-management-filters/access-management-filters.component';
import { AccessLogFiltersComponent } from './+admin-page/+superuser-page/access-log-filters/access-log-filters.component';
import { AdminDashboardPageComponent } from './+admin-page/+admin-dashboard-page/admin-dashboard-page.component';
import { ApprovalModalComponent } from './approval-modal/approval-modal.component';
import { RejectionModalComponent } from './rejection-modal/rejection-modal.component';
import { UserEditModalComponent } from './+admin-page/+superuser-page/user-edit-modal/user-edit-modal.component';
import { AdminConnectionsPageComponent } from './+admin-page/+admin-connections-page/admin-connections-page.component';
import { InvitationPanelPageComponent } from './+admin-page/+invitation-panel-page/invitation-panel-page.component';
import { SnackBarCustomComponent } from './+admin-page/+invitation-panel-page/snack-bar-custom/snack-bar-custom.component';
// tslint:enable

const components = [
  AdminPageComponent,
  CompliancePageComponent,
  ProductsPageComponent,
  SuppliersPageComponent,
  ComplianceDetailsPageComponent,
  ProductDetailsPageComponent,
  SupplierDetailsPageComponent,
  AdminDrawerComponent,
  ComplianceTableComponent,
  ComplianceFiltersComponent,
  SuppliersTableComponent,
  SuppliersFiltersComponent,
  ProductsTableComponent,
  ProductsFiltersComponent,
  ProductHeaderComponent,
  SupplierReviewPageComponent,
  SupplierProductsPageComponent,
  SupplierCompliancePageComponent,
  ProductSupplierPageComponent,
  ProductReviewPageComponent,
  ProductCompliancePageComponent,
  HeaderControlsComponent,
  ComplianceSupplierPageComponent,
  ComplianceProductPageComponent,
  ComplianceReviewPageComponent,
  ApprovalStatusComponent,
  RejectionStatusComponent,
  SuperuserPageComponent,
  AccessManagementTableComponent,
  ErrorHandlingTableComponent,
  AccessLogTableComponent,
  AccessManagementFiltersComponent,
  AccessLogFiltersComponent,
  ErrorHandlingFiltersComponent,
  BanksPageComponent,
  BanksTableComponent,
  BanksFiltersComponent,
  AdminDashboardPageComponent,
  AdminConnectionsPageComponent,
  InvitationPanelPageComponent,
  SnackBarCustomComponent
];

const modals = [
  ApprovalModalComponent,
  RejectionModalComponent,
  UserEditModalComponent
];

import { DashboardModule } from '../dashboard/dashboard.module';
import { SharedModule } from '@shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { EditTablesComponent } from './+admin-page/+edit-tables-page/edit-tables.component';
import { ListItemComponent } from './+admin-page/+edit-tables-page/partials/list-item/list-item.component';
import { ListComponent } from './+admin-page/+edit-tables-page/partials/list/list.component';
import { SimpleTableComponent } from './+admin-page/+edit-tables-page/partials/simple-table/simple-table.component';
import { ListItemTitleComponent } from './+admin-page/+edit-tables-page/partials/list-item-title/list-item-title.component';
import { TaxonomyListComponent } from './+admin-page/+edit-tables-page/partials/taxonomy-list/taxonomy-list.component';
import { CreateButtonTableComponent } from './+admin-page/+edit-tables-page/partials/create-button-table/create-button-table.component';
import { ModalPreviewComponent } from './+admin-page/+edit-tables-page/partials/modal-preview/modal-preview.component';
import { InviteSuppliersModule } from '../invite-suppliers-module/invite-suppliers.module';

@NgModule({
  imports: [
    SharedModule,
    DashboardModule,
    AdminRoutingModule,
    InviteSuppliersModule,
    StoreModule.forFeature(fromAdmin.adminFeatureKey, fromAdmin.REDUCERS_TOKEN, { metaReducers: fromAdmin.metaReducers }),
    EffectsModule.forFeature(effects)
  ],
  providers: [fromAdmin.reducerProvider],
  declarations: [
    ...components,
    ...modals,
    EditTablesComponent,
    ListItemComponent,
    ListComponent,
    SimpleTableComponent,
    ListItemTitleComponent,
    TaxonomyListComponent,
    CreateButtonTableComponent,
    ModalPreviewComponent,
  ],
  exports: [
    ...components,
    ...modals,
  ],
  entryComponents: [
    ...modals
  ]
})
export class AdminModule { }
