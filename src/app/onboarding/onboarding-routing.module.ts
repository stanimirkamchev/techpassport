import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { OnboardingLayoutComponent } from './onboarding-layout/onboarding-layout.component';
import { OnboardingStartupComponent } from './onboarding-startup/onboarding-startup.component';
import { ProductSettingsComponent } from './product-settings/product-settings.component';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import { ProductsListComponent } from './products-list/products-list.component';

const routes: Route[] = [
  {
    path: 'onboarding',
    pathMatch: 'prefix',
    component: OnboardingLayoutComponent,
    children: [
      {
        path: '',
        component: OnboardingStartupComponent
      },
      {
        path: 'profile',
        component: ProfileSettingsComponent
      },
      {
        path: 'product',
        component: ProductsListComponent
      },
      {
        path: 'product/add',
        component: ProductSettingsComponent
      },
      {
        path: 'product/edit/:productId',
        component: ProductSettingsComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class OnboardingRoutingModule {}
