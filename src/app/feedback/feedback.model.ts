import { Validators, FormGroup } from '@angular/forms';

export enum FeedbackControlType {
  Select = 'Select',
  Textarea = 'Textarea',
  Rating = 'Rating',
}

export interface FeedbackControlOption {
  label: string;
  value: string;
}

export interface FeedbackControlSchema {
  type: FeedbackControlType;
  name: string;
  label?: string;
  placeholder?: string;
  value?: string | number;
  options?: FeedbackControlOption[];
  validators?: Validators;
}

export interface FeedbackQuestionSchema {
  title?: string;
  name: string;
  controls: FeedbackControlSchema[];
}

export interface FeedbackModel {
  answers: {
    [questionName: string]: {
      [controlName: string]: string;
    }
  };
}

export interface FeedbackSchema {
  draft: boolean;
  questions: FeedbackQuestionSchema[];
  projectName?: string;
  projectId?: string;
  startDate?: string;
  endDate?: string;
}


