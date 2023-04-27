import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { CompliancePageComponent } from './+admin-page/+compliance-page/compliance-page.component';
import { ComplianceDetailsPageComponent } from './+admin-page/+compliance-page/+compliance-details-page/compliance-details-page.component';
import { ProductsPageComponent } from './+admin-page/+products-page/products-page.component';
import { ProductDetailsPageComponent } from './+admin-page/+products-page/+product-details-page/product-details-page.component';
import { SuppliersPageComponent } from './+admin-page/+suppliers-page/suppliers-page.component';
import { SupplierDetailsPageComponent } from './+admin-page/+suppliers-page/+supplier-details-page/supplier-details-page.component';
import { AdminPageComponent } from './+admin-page/admin-page.component';
// tslint:disable
import { SupplierReviewPageComponent } from './+admin-page/+suppliers-page/+supplier-details-page/+supplier-review-page/supplier-review-page.component';
import { SupplierProductsPageComponent } from './+admin-page/+suppliers-page/+supplier-details-page/+supplier-products-page/supplier-products-page.component';
import { SupplierCompliancePageComponent } from './+admin-page/+suppliers-page/+supplier-details-page/+supplier-compliance-page/supplier-compliance-page.component';
import { ProductReviewPageComponent } from './+admin-page/+products-page/+product-details-page/+product-review-page/product-review-page.component';
import { ProductSupplierPageComponent } from './+admin-page/+products-page/+product-details-page/+product-supplier-page/product-supplier-page.component';
import { ProductCompliancePageComponent } from './+admin-page/+products-page/+product-details-page/+product-compliance-page/product-compliance-page.component';
import { ComplianceReviewPageComponent } from './+admin-page/+compliance-page/+compliance-details-page/+compliance-review-page/compliance-review-page.component';
import { ComplianceProductPageComponent } from './+admin-page/+compliance-page/+compliance-details-page/+compliance-product-page/compliance-product-page.component';
import { ComplianceSupplierPageComponent } from './+admin-page/+compliance-page/+compliance-details-page/+compliance-supplier-page/compliance-supplier-page.component';
import { SuperuserPageComponent } from './+admin-page/+superuser-page/superuser-page.component';
import { BanksPageComponent } from './+admin-page/+banks-page/banks-page.component';
import { AdminDashboardPageComponent } from './+admin-page/+admin-dashboard-page/admin-dashboard-page.component';
import { AdminConnectionsPageComponent } from './+admin-page/+admin-connections-page/admin-connections-page.component';
import { InvitationPanelPageComponent } from './+admin-page/+invitation-panel-page/invitation-panel-page.component';
import { OuterMarketPageComponent } from '../portal/+outer-market-page/outer-market-page.component';
import { EnterpriseReadyQuestionsDashboardComponent } from './../portal/enterprise-ready-questions/enterprise-ready-questions-dashboard.component';
import { EditTablesComponent } from './+admin-page/+edit-tables-page/edit-tables.component';

// tslint:enable

const routes: Route[] = [
  {
    path: 'admin',
    pathMatch: 'prefix',
    component: AdminPageComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'suppliers'
      },
      {
        path: 'dashboard',
        component: AdminDashboardPageComponent,
      },
      {
        path: 'connections',
        component: AdminConnectionsPageComponent,
      },
      {
        path: 'market',
        component: OuterMarketPageComponent,
      },
      {
        path: 'dataIO',
        component: InvitationPanelPageComponent,
      },
      {
        path: 'superuser',
        component: SuperuserPageComponent,
      },
      {
        path: 'compliance',
        component: CompliancePageComponent,
        children: [
          {
            path: ':id',
            component: ComplianceDetailsPageComponent,
            children: [
              {
                path: '',
                pathMatch: 'full',
                redirectTo: 'supplier'
              },
              {
                path: 'supplier',
                component: ComplianceSupplierPageComponent
              },
              {
                path: 'product',
                component: ComplianceProductPageComponent
              },
              {
                path: 'review',
                component: ComplianceReviewPageComponent
              }
            ]
          }
        ]
      },
      {
        path: 'products',
        component: ProductsPageComponent,
        children: [
          {
            path: ':id',
            component: ProductDetailsPageComponent,
            children: [
              {
                path: '',
                pathMatch: 'full',
                redirectTo: 'review'
              },
              {
                path: 'supplier',
                component: ProductSupplierPageComponent
              },
              {
                path: 'review',
                component: ProductReviewPageComponent
              },
              {
                path: 'compliance',
                component: ProductCompliancePageComponent
              }
            ]
          }
        ]
      },
      {
        path: 'suppliers',
        component: SuppliersPageComponent,
        children: [
          {
            path: ':id',
            component: SupplierDetailsPageComponent,
            children: [
              {
                path: '',
                pathMatch: 'full',
                redirectTo: 'review'
              },
              {
                path: 'review',
                component: SupplierReviewPageComponent
              },
              {
                path: 'products',
                component: SupplierProductsPageComponent
              },
              {
                path: 'compliance',
                component: SupplierCompliancePageComponent
              }
            ]
          }
        ]
      },
      {
        path: 'banks',
        component: BanksPageComponent,
      },
      {
        path: 'editTables',
        component: EditTablesComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
