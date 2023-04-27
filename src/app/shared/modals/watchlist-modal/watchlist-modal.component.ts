import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter, Input } from '@angular/core';
import { ApiService } from 'src/app/common/services/api/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-watch-lists-modal',
  templateUrl: './watchlist-modal.component.html',
  styleUrls: ['./watchlist-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WatchlistModalComponent implements OnInit {
  @Input() selectedProducts: any[] = [];
  watchLists: any[];
  addedMap = {};
  spinnerIsVisible = true;

  @Output() close = new EventEmitter();
  @Output() added = new EventEmitter();

  constructor(
    private apiService: ApiService,
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.spinnerIsVisible = true;
    this.getWatchLists();
  }

  getWatchLists() {
    this.apiService.getMyWatchLists().subscribe((res) => {
      this.spinnerIsVisible = false;
      this.watchLists = res;
      this.cdRef.detectChanges();
    });
  }

  onAddProductsToWatchlist(watchlist) {
    this.spinnerIsVisible = true;

    this.apiService
      .addProductsToWatchlist(watchlist._id, this.selectedProducts)
      .subscribe((res) => {
        this.addedMap = {
          ...this.addedMap,
          [watchlist._id]: true,
        };
        this.spinnerIsVisible = false;
        this.added.emit();
        this.getWatchLists();
        this.cdRef.detectChanges();
      }, () => {
        this.spinnerIsVisible = false;
        this.cdRef.detectChanges();
      });
  }

  viewAllWatchlists() {
    this.router.navigate(['/portal'], { queryParams: { page: 'watchlist' } });
  }

  closeModal() {
    this.close.emit();
  }
}
