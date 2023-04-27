import { Component, Input, OnInit } from '@angular/core';
import { WatchList } from '../../types/watchlist.type';
import * as moment from 'moment';
import { WatchListService } from '../../service';

@Component({
  selector: 'company-watchlists',
  templateUrl: './company-watchlists.component.html',
  styleUrls: ['./company-watchlists.component.scss']
})
export class CompanyWatchlistsComponent implements OnInit {
  @Input() watchLists: WatchList[];

  constructor(private watchlistService: WatchListService) { }

  selectedProductIds: { watchlistId: string, productIds: string[] }[] = [];

  isFavorite(watchlist: WatchList) {
    return moment().diff(moment(watchlist.updatedAt), 'week') <= 2;
  }
  getSuffix(value: number) {
    if (value === 1) { return ''; }
    return 's';
  }

  toggleSelect({ watchlistId, product }: any) {
    // TODO: Use toggleSelection method in watchlist service
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

    const count = this.selectedProductIds.reduce((acc, item) => acc + item.productIds.length, 0);
    this.watchlistService.setCompanyWatchListItemsSelected(count > 0);
  }

  ngOnInit(): void {
    this.watchlistService.selectedProductIdsOverview$.subscribe((res) => {
      this.selectedProductIds = res;
    });
  }

  uniqueCollaboratorsEmails(watchList: WatchList) {
    const emailsArray = new Set(watchList.collaborators?.map(x => x.email));
    return Array.from(emailsArray);
  }
}
