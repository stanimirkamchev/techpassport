import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarketplaceLayoutComponent } from './marketplace-layout/marketplace-layout.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { ProductListComponent } from './product-list/product-list.component';

const routes: Routes = [
  {
    path: 'marketplace',
    component: MarketplaceLayoutComponent,
    children: [
      {
        path: '',
        component: MarketplaceComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketplaceRoutingModule { }
