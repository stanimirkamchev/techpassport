import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WatchList } from '../../types/watchlist.type';
import { WatchListService } from '../../service';
import { MatDialog } from '@angular/material/dialog';
import { EditWatchlistModalComponent } from '../edit-watchlist-modal/edit-watchlist-modal.component';
import { InviteWatchlistModalComponent } from '../invite-watchlist-modal/invite-watchlist-modal.component';
import * as moment from 'moment';

@Component({
  selector: 'my-watchlists',
  templateUrl: './my-watchlists.component.html',
  styleUrls: ['./my-watchlists.component.scss']
})
export class MyWatchlistsComponent implements OnInit {
  @Input() watchLists: WatchList[];
  @Input() loading: boolean;
  @Output() refresh = new EventEmitter();

  selectedProductIds: { watchlistId: string, productIds: string[] }[] = [];

  constructor(
    private watchlistService: WatchListService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.watchlistService.selectedProductIdsOverview$.subscribe((res) => {
      this.selectedProductIds = res;
    });
  }

  toggleSelect({ watchlistId, product }: any) {
    // TODO: Use toggleSelection method in watchlist service
    // this.watchlistService.toggleSelection({ watchlistId, product });
    const existWatchList = this.selectedProductIds.find((item) => item.watchlistId === watchlistId);

    if (!existWatchList) {
      this.watchlistService.setSelectedProductIds([
        ...this.selectedProductIds,
        {
          watchlistId,
          productIds: [product.id]
        }
      ]);
    } else {
      const existProduct = existWatchList.productIds.includes(product.id);

      this.watchlistService.setSelectedProductIds(
        this.selectedProductIds.map((item) => item.watchlistId === watchlistId ? ({
          watchlistId,
          productIds: existProduct ? existWatchList.productIds.filter((id) => id !== product.id) : [...existWatchList.productIds, product.id]
        }) : item)
      );
    }
  }

  onRefresh() {
    console.log('refresh');
    this.refresh.emit();
  }

  openEditModal(event, watchlist: WatchList) {
    event.stopPropagation();

    const ref = this.dialog.open(EditWatchlistModalComponent, {
      width: '720px',
      maxWidth: undefined,
      panelClass: 'modal',
      disableClose: false,
      data: {
        watchlist,
      }
    });
    ref.componentInstance.refresh.subscribe((res) => {
      this.refresh.emit();
    });

    ref.afterClosed().subscribe((result) => {
      if (result === 'success' && this.refresh) {
        this.refresh.emit();
      }
    });
  }

  openInviteModal(event, watchlist: WatchList) {
    event.stopPropagation();
    const ref = this.dialog.open(InviteWatchlistModalComponent, {
      width: '720px',
      maxWidth: undefined,
      panelClass: 'modal',
      disableClose: false,
      data: watchlist
    });
    ref.afterClosed().subscribe((result) => {
      if (result === 'success' && this.refresh) {
        this.refresh.emit();
      }
    });
  }

  isFavorite(watchlist: WatchList) {
    const recentlyUpdated = moment().diff(moment(watchlist.updatedAt), 'week') <= 2;
    const recentlyUpdatedProduct = watchlist.products.find((item) => moment().diff(moment(item.updatedAt), 'week') <= 2)

    return recentlyUpdated || !!recentlyUpdatedProduct;
  }
  getSuffix(value: number) {
    if (value === 1) { return ''; }
    return 's';
  }
}
