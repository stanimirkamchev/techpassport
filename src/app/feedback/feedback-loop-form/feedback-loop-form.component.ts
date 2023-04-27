import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

import { feedbackLoopFormBuilder } from '../feedback-loop';
import { FeedbackSchema, FeedbackControlType } from '../feedback.model';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '@services/api/api.service';

// export const testModel = {
//   projectId: '1231234',
//   projectName: 'Test Project',
//   options: {
//     poc: {
//       value: ['Product 1 - Supplier 1', 'Product XYZ - Supplier ZXCVBNM']
//     }
//   },
//   answers: {
//     product: {
//       performance: 2
//     }
//   }
// } as FeedbackModel;

@Component({
  selector: 'feedback-loop-form',
  templateUrl: './feedback-loop-form.component.html',
  styleUrls: ['./feedback-loop-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedbackLoopFormComponent implements OnInit, OnDestroy {

  @Input() set schema(schema: FeedbackSchema) {
    if (schema) {
      this.formGroup = feedbackLoopFormBuilder(schema);
      this.feedbackLoop = schema;
    }
  }

  @Output() formSubmit = new EventEmitter();
  @Output() formSubmitDraft = new EventEmitter();
  @Output() cancel = new EventEmitter();


  formGroup: FormGroup;
  feedbackLoop: FeedbackSchema;
  FeedbackControlType = FeedbackControlType;

  private destroyed$ = new Subject();

  public iAmABuyer: boolean = false;

  constructor(apiService: ApiService) {
    this.iAmABuyer = apiService.sessionObject.type === 'customer';
  }

  ngOnInit() {
    console.log('feedbackLoop', this.feedbackLoop);
    this.formGroup.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(console.log);
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
