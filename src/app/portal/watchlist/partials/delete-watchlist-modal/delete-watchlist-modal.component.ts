import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ApiService } from "@services/api/api.service";

@Component({
  selector: 'delete-watchlist-modal',
  templateUrl: './delete-watchlist-modal.component.html',
  styleUrls: ['./delete-watchlist-modal.component.scss']
})
export class DeleteWatchlistModalComponent implements OnInit {
  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<DeleteWatchlistModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  cancel() {
    this.dialogRef.close();
  }
  onSave() {
    this.apiService.removeWatchlist(this.data.watchlist._id).subscribe((res) => {
      this.dialogRef.close('success');
    });
  }
}
