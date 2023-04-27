import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';
import { EffectsModule } from '@ngrx/effects';

import * as fromFeedbackStore from './store';

import { FeedbackLoopFormComponent } from './feedback-loop-form/feedback-loop-form.component';
import { FeedbackControlTextareaComponent } from './feedback-control-textarea/feedback-control-textarea.component';
import { FeedbackControlRatingComponent } from './feedback-control-rating/feedback-control-rating.component';
import { FeedbackControlSelectComponent } from './feedback-control-select/feedback-control-select.component';

const components = [
  FeedbackLoopFormComponent,
  FeedbackControlSelectComponent,
  FeedbackControlRatingComponent,
  FeedbackControlTextareaComponent,
];

import { FeedbackLoopModalComponent } from './feedback-loop-modal/feedback-loop-modal.component';

const modals = [
  FeedbackLoopModalComponent
];

@NgModule({
  imports: [
    SharedModule,
    StoreModule.forFeature(
      fromFeedbackStore.feedbackFeatureKey,
      fromFeedbackStore.reducer
    ),
    EffectsModule.forFeature([fromFeedbackStore.FeedbackEffects])
  ],
  declarations: [
    ...components,
    ...modals
  ],
  entryComponents: [
    ...modals
  ]
})
export class FeedbackModule { }
