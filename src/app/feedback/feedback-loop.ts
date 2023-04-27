import { FeedbackSchema, FeedbackControlType, FeedbackModel } from './feedback.model';
import { FormGroup, FormControl } from '@angular/forms';
import { isFunction } from 'lodash';

export const feedbackLoopSchema: FeedbackSchema = {
  draft: true,
  questions: [
    {
      title: '1. Which product and supplier?',
      name: 'poc',
      controls: [{
        type: FeedbackControlType.Select,
        label: 'Select from the list',
        name: 'value'
      }, {
        type: FeedbackControlType.Textarea,
        placeholder: 'Write here...',
        label: 'Explain your answer',
        name: 'explanation'
      }]
    }
  ]
};

const propIsResolvable = (prop: string | ((fg: FormGroup) => string)): prop is (fg: FormGroup) => string => isFunction(prop);

export const feedbackLoopFactory = (schema = feedbackLoopSchema, model?: FeedbackModel, formGroup?: FormGroup): FeedbackSchema => ({
  ...schema,
  questions: [
    ...schema.questions.map(question => ({
      ...question,
      title: propIsResolvable(question.title) ? question.title.apply(this, formGroup) : question.title,
      controls: [
        ...question.controls.map(control => ({
          ...control,
          // options: feedbackLoopSchema?.questions?.[question.name]?.[control.name],
          // value: model?.answers?.[question.name]?.[control.name] || ''
        }))
      ]
    }))
  ]
});

const fromEntries = <T extends Array<unknown>>(arr: T) =>
  Object.assign({}, ...Array.from(arr, ([k, v]) => ({ [k]: v })));


export const feedbackLoopFormBuilder = (schema: FeedbackSchema = feedbackLoopSchema): FormGroup =>
  new FormGroup(fromEntries(schema.questions.map(({ name, controls }) =>
    [name, new FormGroup(fromEntries(controls.map(({ name: controlName, value }) =>
      [controlName, new FormControl(value)]
    )))]
  )));


