import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { OuterMarketPageComponent } from './outer-market-page.component';
import { OuterMarketTableComponent } from './outer-market-table/outer-market-table.component';
import { SharedModule } from '@shared/shared.module';
import { OuterMarketFiltersComponent } from './outer-market-filters/outer-market-filters.component';
import { TabsInfoComponent } from './outer-market-table/partials/tabs-info/tabs-info.component';
import { ListInfoComponent } from './outer-market-table/partials/list-info/list-info.component';
import { DescriptionInfoComponent } from './outer-market-table/partials/description-info/description-info.component';
import { OuterMarketEffects } from './store/index.effects';
import * as fromOuterMarketStore from './store';
import { SearchesPreviewComponent } from './outer-market-filters/partials/searches-preview/searches-preview.component';


// tslint:enable

const effects = [
  OuterMarketEffects
];


const components = [
    OuterMarketPageComponent,
    OuterMarketTableComponent,
];


@NgModule({
  imports: [
    SharedModule,
    StoreModule.forFeature(
      fromOuterMarketStore.outerMarketFeatureKey,
      fromOuterMarketStore.REDUCERS_TOKEN,
      { metaReducers: fromOuterMarketStore.metaReducers
    }),
    EffectsModule.forFeature(effects)
  ],
  providers: [fromOuterMarketStore.reducerProvider],
  declarations: [
    ...components,
    OuterMarketFiltersComponent,
    TabsInfoComponent,
    ListInfoComponent,
    DescriptionInfoComponent,
    SearchesPreviewComponent,
  ],
  exports: [
    ...components,
  ]
})
export class OuterMarketModule { }
