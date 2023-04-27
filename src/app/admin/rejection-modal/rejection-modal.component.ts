import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './rejection-modal.component.html',
  styleUrls: ['./rejection-modal.component.scss']
})
export class RejectionModalComponent implements OnInit {

  formGroup = new FormGroup({
    subject: new FormControl('', Validators.required),
    reason: new FormControl('', Validators.required)
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    if (this.data && this.data.review) {
      this.formGroup.get('subject').setValue(this.data.review.subject);
      this.formGroup.get('reason').setValue(this.data.review.comment);
    }
    if (this.data && this.data.readonly) {
      this.formGroup.disable();
    }
  }
}
