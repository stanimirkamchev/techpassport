import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarketplaceModule } from '../marketplace/marketplace.module';
import { DashboardPageComponent } from './+dashboard-page/dashboard.component';
import { PortalPageComponent } from './+portal-page/portal.component';
import { ConnectionsPageComponent } from './+connections-page/connections-page.component';

const routes: Routes = [
  {
    path: '',
    component: PortalPageComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardPageComponent,
      },
      {
        path: 'market',
        loadChildren: () => import('../marketplace/marketplace.module').then(m => m.MarketplaceModule),
      },
      {
        path: 'connection',
        component: ConnectionsPageComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortalRoutingModule { }
