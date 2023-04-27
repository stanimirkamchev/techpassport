import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@services/api/api.service';
import { InviteSentModalComponent } from '../invite-sent-modal/invite-sent-modal.component';

@Component({
  selector: 'invite-watchlist-modal',
  templateUrl: './invite-watchlist-modal.component.html',
  styleUrls: ['./invite-watchlist-modal.component.scss']
})
export class InviteWatchlistModalComponent implements OnInit {
  formGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  errorMessage: string;

  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<InviteWatchlistModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  cancel() {
    this.dialogRef.close();
  }

  get f(): any {
    return this.formGroup.controls;
  }

  isFieldInvalid(field): boolean {
    return this.f[field].errors && (this.f[field].dirty || this.f[field].touched);
  }

  onSave() {
    const values = this.formGroup.getRawValue();
    console.log('values', values);

    this.apiService.inviteCollaborator(this.data._id, values).subscribe((res) => {
      this.dialogRef.close('success');

      const ref = this.dialog.open(InviteSentModalComponent, {
        width: '720px',
        maxWidth: undefined,
        panelClass: 'modal',
        disableClose: false,
      });

      ref.afterClosed().subscribe(() => {});
    }, (err) => {
      if (err.error.message) {
        this.errorMessage = err.error.message;
      }
    });
  }

  inviteToPlatform() {
    // TODO send invite email
  }
}
