import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { DashboardPageComponent } from './+dashboard-page/dashboard-page.component';

const routes: Route[] = [
  {
    path: 'portal/customer/dashboard',
    component: DashboardPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
