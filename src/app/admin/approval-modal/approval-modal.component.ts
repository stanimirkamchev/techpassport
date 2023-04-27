import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ApprovalModalData } from './approval-modal';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  templateUrl: './approval-modal.component.html',
  styleUrls: ['./approval-modal.component.scss']
})
export class ApprovalModalComponent implements OnInit {

  formGroup = new FormGroup({
    subject: new FormControl('', Validators.required),
    reason: new FormControl('', Validators.required)
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
