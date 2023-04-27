import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FeedbackSchema, FeedbackModel } from '../feedback.model';

@Component({
  selector: 'feedback-loop-modal',
  templateUrl: './feedback-loop-modal.component.html',
  styleUrls: ['./feedback-loop-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedbackLoopModalComponent {

  constructor(
    public dialogRef: MatDialogRef<FeedbackLoopModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { feedbackLoop: FeedbackModel, schema: FeedbackSchema }) { }
}
