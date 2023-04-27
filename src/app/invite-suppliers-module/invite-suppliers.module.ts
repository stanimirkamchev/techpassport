import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '@shared/shared.module';

import { InviteSuppliersEffects } from './store/index.effects';
import * as fromInviteSuppliersStore from './store';

import { InviteSuppliersPageComponent } from './invite-suppliers-page.component';
import { InvitationFiltersComponent } from './invitation-filters/invitation-filters.component';
import { InvitationTableComponent } from './invitation-table/invitation-table.component';
import { InvitationPaginationsComponent } from './invitation-paginations/invitation-paginations.component';
import { RequestUpdateModalComponent } from './request-update-modal/request-update-modal.component';
import { TppNoteModalComponent } from './tpp-note-modal/tpp-note-modal.component';
import { InvitePreviewModalComponent } from './invite-preview-modal/invite-preview-modal.component';

// tslint:enable
const effects = [
  InviteSuppliersEffects
];

const components = [
  InviteSuppliersPageComponent,
  InvitationFiltersComponent,
  InvitationTableComponent,
  InvitationPaginationsComponent,
  RequestUpdateModalComponent,
  TppNoteModalComponent,
  InvitePreviewModalComponent,
];

@NgModule({
  imports: [
    SharedModule,
    StoreModule.forFeature(
      fromInviteSuppliersStore.inviteSuppliersFeatureKey,
      fromInviteSuppliersStore.REDUCERS_TOKEN,
      {
        metaReducers: fromInviteSuppliersStore.metaReducers
      }),
    EffectsModule.forFeature(effects)
  ],
  providers: [fromInviteSuppliersStore.reducerProvider],
  declarations: [
    ...components,
  ],
  exports: [
    ...components,
  ]
})
export class InviteSuppliersModule { }
