import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '@services/api/api.service';

@Component({
  selector: 'leave-watchlist-modal',
  templateUrl: './leave-watchlist-modal.component.html',
  styleUrls: ['./leave-watchlist-modal.component.scss']
})
export class LeaveWatchlistModalComponent {
  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<LeaveWatchlistModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  cancel() {
    this.dialogRef.close();
  }

  onSave() {
    this.dialogRef.close();
    this.apiService.leaveCollaboratorFromWatchlist(this.data.watchlist._id, this.data.collaboratorId).subscribe((res) => {
      this.dialogRef.close('success');
    });
  }
}
