import { createReducer } from '@ngrx/store';
import { FeedbackSchema, FeedbackModel } from '../feedback.model';

export const feedbackFeatureKey = 'feedback';

export interface State {
  feedbackLoop: {
    loaded: boolean;
    loading: boolean;
    schema?: FeedbackSchema;
    model?: FeedbackModel;
  };
}

const initialState: State = {
  feedbackLoop: {
    loaded: false,
    loading: false
  }
};

export const reducer = createReducer(
  initialState
);
