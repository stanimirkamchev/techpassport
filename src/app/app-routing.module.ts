import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './+home-page/home.component';
import { AboutPageComponent } from './+about-page/about.component';
import { PortalPageComponent } from './portal/+portal-page/portal.component';
import { JoinPageComponent } from './join-page/join-page.component';
// import { CustomerPageComponent } from './portal/+customer-page/customer.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'join', component: JoinPageComponent },
  { path: 'home', component: HomePageComponent },
  { path: 'about', component: AboutPageComponent },
  { path: 'portal', component: PortalPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
