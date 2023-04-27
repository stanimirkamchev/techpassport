import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { MarketplaceRoutingModule } from './marketplace-routing.module';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductFilterComponent } from './product-filter/product-filter.component';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { OuterMarketModule } from '../portal/+outer-market-page/outerMarket.module';
import { MarketplaceLayoutComponent } from './marketplace-layout/marketplace-layout.component';
import { FilterModalComponent } from './filter-modal/filter-modal.component';
import { CheckboxesComponent } from './filter-modal/partials/checkboxes/checkboxes.component';
import { SelectMinMaxComponent } from './filter-modal/partials/select-min-max/select-min-max.component';
import { SliderRangeComponent } from './filter-modal/partials/slider-range/slider-range.component';
import { BrowserModule } from '@angular/platform-browser';
import { CustomPaginatorComponent } from './custom-paginator/custom-paginator.component';
import { MatChipsModule } from '@angular/material/chips';
import { NewSupplierListComponent } from './new-supplier-list/new-supplier-list.component';
import { FISModalComponent } from './FIS-modal/FIS-modal.component';
import { ProductCompareComponent } from './product-compare/product-compare.component';
import { CheckboxesLayerComponent } from './filter-modal/partials/checkboxes-layer/checkboxes-layer.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { SelectionComponent } from './filter-modal/partials/selection/selection.component';
import { InformationRequestedComponent } from './information-requested/information-requested.component';
import { SuggestionListComponent } from './filter-modal/partials/suggestion-list/suggestion-list.component';
import { TaxonomyFilterComponent } from './filter-modal/partials/taxonomy-filter/taxonomy-filter.component';
import { UsecaseFilterComponent } from './filter-modal/partials/usecase-filter/usecase-filter.component';
import { MatIconModule } from '@angular/material/icon';
import { DashboardModule } from '../dashboard/dashboard.module';
import { StoreModule } from '@ngrx/store';
import * as fromMarketplaceStore from './store';
import { MarketplaceEffects } from './store/index.effects';

import { EffectsModule } from '@ngrx/effects';

const effects = [
  MarketplaceEffects
];

@NgModule({
  declarations: [
    ProductListComponent,
    ProductFilterComponent,
    SupplierListComponent,
    MarketplaceComponent,
    MarketplaceLayoutComponent,
    FilterModalComponent,
    CheckboxesComponent,
    SelectMinMaxComponent,
    SliderRangeComponent,
    CustomPaginatorComponent,
    NewSupplierListComponent,
    FISModalComponent,
    ProductCompareComponent,
    CheckboxesLayerComponent,
    SelectionComponent,
    InformationRequestedComponent,
    SuggestionListComponent,
    TaxonomyFilterComponent,
    UsecaseFilterComponent,
  ],
  imports: [
    StoreModule.forFeature(
      fromMarketplaceStore.marketplaceFeatureKey,
      fromMarketplaceStore.REDUCERS_TOKEN,
      {
        metaReducers: fromMarketplaceStore.metaReducers
      }),
    EffectsModule.forFeature(effects),
    CommonModule,
    SharedModule,
    BrowserModule,
    OuterMarketModule,
    MarketplaceRoutingModule,
    MatChipsModule,
    MatIconModule,
    NgxSliderModule,
    DashboardModule
  ],
  providers: [fromMarketplaceStore.reducerProvider],
  exports: [
    MarketplaceComponent
  ]
})
export class MarketplaceModule { }
