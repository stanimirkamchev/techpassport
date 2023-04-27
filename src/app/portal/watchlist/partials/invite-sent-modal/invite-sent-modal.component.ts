import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'invite-sent-modal',
  templateUrl: './invite-sent-modal.component.html',
  styleUrls: ['./invite-sent-modal.component.scss']
})
export class InviteSentModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<InviteSentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }

  cancel() {
    this.dialogRef.close();
  }
}
