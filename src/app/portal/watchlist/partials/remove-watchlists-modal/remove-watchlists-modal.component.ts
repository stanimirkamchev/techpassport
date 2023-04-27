import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WatchListService } from '../../service';
import { ApiService } from '@services/api/api.service';

@Component({
  selector: 'remove-watchlists-modal',
  templateUrl: './remove-watchlists-modal.component.html',
  styleUrls: ['./remove-watchlists-modal.component.scss']
})
export class RemoveWatchlistsModalComponent implements OnInit {
  selectedProductIds = [];

  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<RemoveWatchlistsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private watchListService: WatchListService,
  ) { }

  ngOnInit(): void {
    this.watchListService.selectedProductIdsOverview$.subscribe((res) => {
      this.selectedProductIds = res;
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  onSave() {
    this.apiService.removeProductsFromWatchlist(this.selectedProductIds).subscribe(() => {
      this.watchListService.setSelectedProductIds([]);
      this.dialogRef.close('success');
    });
  }
}
