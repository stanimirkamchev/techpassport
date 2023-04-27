import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class WatchListService {
  private watchLists = {
    data: [],
    totalCount: 0
  };
  private selectedProductIds: { watchlistId: string, productIds: string[] }[] = [];

  private $watchListsSource = new BehaviorSubject(this.watchLists);
  private selectedProductIdsSource$ = new BehaviorSubject(this.selectedProductIds);
  private selectedProductCount = new BehaviorSubject(0);
  private clearAll = new BehaviorSubject(false);
  private totalCount = new BehaviorSubject(0);
  private companyWatchListItemsSelected = new BehaviorSubject<boolean>(false);

  public readonly selectedProductIdsOverview$: Observable<any[]> = this.selectedProductIdsSource$.asObservable();
  public readonly selectedProductCount$: Observable<number> = this.selectedProductCount.asObservable();
  public readonly clearAll$: Observable<boolean> = this.clearAll.asObservable();
  public readonly totalCount$: Observable<number> = this.totalCount.asObservable();
  public readonly companyWatchListItemsSelected$: Observable<boolean> = this.companyWatchListItemsSelected.asObservable();

  constructor() { }

  setSelectedProductIds(data: { watchlistId: string, productIds: string[] }[]) {
    const count = data.reduce((acc, item) => acc + item.productIds.length, 0);
    this.selectedProductCount.next(count);
    this.selectedProductIdsSource$.next(data);
  }

  setClearProductIds(val: boolean) {
    this.selectedProductCount.next(0);
    this.selectedProductIdsSource$.next([]);
    this.clearAll.next(val);
  }

  setTotalCount(num: number) {
    this.totalCount.next(num);
  }

  setCompanyWatchListItemsSelected(val: boolean) {
    this.companyWatchListItemsSelected.next(val);
  }

  clear() {
    this.selectedProductCount.next(0);
    this.selectedProductIdsSource$.next([]);
  }

  // TODO: use this method to eliminate duplicate code.
  toggleSelection({ watchlistId, product }) {
    const existWatchList = this.selectedProductIds.find((item) => item.watchlistId === watchlistId);
    if (!existWatchList) {
      this.selectedProductIdsSource$.next([{ watchlistId, productIds: [product.id] }]);
      // this.setSelectedProductIds([
      //   ...this.selectedProductIds,
      //   {
      //     watchlistId,
      //     productIds: [product.id]
      //   }
      // ]);
    } else {
      const existProduct = existWatchList.productIds.includes(product.id);
      const c =
        this.selectedProductIds.map((item) => item.watchlistId === watchlistId ? ({
          watchlistId,
          productIds: existProduct ? existWatchList.productIds.filter((id) => id !== product.id) : [...existWatchList.productIds, product.id]
        }) : item);
      this.selectedProductIdsSource$.next(c);
      // this.setSelectedProductIds(c);
    }
  }
}
