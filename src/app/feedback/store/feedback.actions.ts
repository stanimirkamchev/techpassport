import { createAction, props } from '@ngrx/store';
import { FeedbackSchema, FeedbackModel } from '../feedback.model';

// getFeedbackLoopSchema
export const getFeedbackLoopSchema = createAction(
  '[Feedback/API] Get Feedback Loop Schema',
  props<{ projectId: string }>()
);

export const getFeedbackLoopSchemaSuccess = createAction(
  '[Feedback/API] Get Feedback Loop Schema Success',
  props<{ schema: FeedbackSchema }>()
);

export const getFeedbackLoopSchemaError = createAction(
  '[Feedback/API] Get Feedback Loop Schema Error',
  props<{ error: any }>()
);


// createFeedbackLoop
export const createFeedbackLoop = createAction(
  '[Feedback/API] Create Feedback Loop',
  props<{ projectId: string }>()
);

export const createFeedbackLoopSuccess = createAction(
  '[Feedback/API] Create Feedback Loop Success',
  props<{ feedbackLoop: FeedbackModel }>()
);

export const createFeedbackLoopError = createAction(
  '[Feedback/API] Create Feedback Loop Error',
  props<{ error: any }>()
);


// updateFeedbackLoop
export const updateFeedbackLoop = createAction(
  '[Feedback/API] Update Feedback Loop',
  props<{ feedbackLoop: FeedbackModel }>()
);

export const updateFeedbackLoopSuccess = createAction(
  '[Feedback/API] Update Feedback Loop Success',
  props<{ feedbackLoop: FeedbackModel }>()
);

export const updateFeedbackLoopError = createAction(
  '[Feedback/API] Update Feedback Loop Error',
  props<{ error: any }>()
);
