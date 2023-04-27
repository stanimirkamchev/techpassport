import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from '@services/api/api.service';
import { ProductModalComponent } from '../../../portal/product-modal/product-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { IErqDto } from 'src/app/portal/enterprise-ready-questions/models/erq-dto';
import { ERQProgressService } from 'src/app/portal/enterprise-ready-questions/service/erq-proggress.service';
import { WatchList } from '../../../portal/watchlist/types/watchlist.type';
import { EditWatchlistModalComponent } from '../../../portal/watchlist/partials/edit-watchlist-modal/edit-watchlist-modal.component';

@Component({
  selector: 'dashboard-watchlist',
  templateUrl: './dashboard-watchlist.component.html',
  styleUrls: ['./dashboard-watchlist.component.scss']
})
export class DashboardWatchlistComponent implements OnInit {

  constructor(
    private addDialog: MatDialog,
    private apiService: ApiService,
    private progressService: ERQProgressService,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
  ) { }

  @Input() set relaod(relaod: number) {
    if (relaod > 0) {
      this.getMyWatchlists();
    }
  }

  @Output() removeFavoriteItem = new EventEmitter<{}>();

  watchlists: any[] = [];
  public erq = {} as IErqDto;
  loading = false;

  progressBar: { [key: string]: { completed: number, compliant: number } } = {
    total: {
      completed: 0,
      compliant: 0
    }
  };

  ngOnInit(): void {
    this.getMyWatchlists();
  }

  getMyWatchlists() {
    this.loading = true;
    this.apiService.getMyWatchLists({}).subscribe((res) => {
      this.watchlists = res;
      this.loading = false;
      this.cdRef.detectChanges();
    }, () => {
      this.loading = false;
    });
  }
  remove(item: any) {
    this.removeFavoriteItem.emit(item);
  }

  roundNumber(val: any) {
    return Number(val).toFixed(0);
  }

  openAdditionalInfo(item: any) {
    const ref = this.addDialog.open(ProductModalComponent, {
      width: '580px',
      height: '100%',
      maxWidth: undefined,
      panelClass: 'product-modal',
      disableClose: false,
      data: { productId: item.product._id }
    });
    ref.afterClosed().subscribe(result => {
      // after close
    });
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
    ref.componentInstance.refresh.subscribe(() => {
      this.getMyWatchlists();
    });
  }

  getSuffix(value: number) {
    if (value === 1) { return ''; }
    return 's';
  }
}
