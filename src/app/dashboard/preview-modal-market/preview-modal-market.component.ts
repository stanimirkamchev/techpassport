import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { State } from 'src/app/store';
import { exportMarketPreview, sortMarketPreview } from '../store/dashboard.actions';
import { MarketPreview } from '../store/dashboard.model';
import { selectMarketPreview } from '../store/dashboard.selectors';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';
import { getName } from 'country-list';

@Component({
  selector: 'app-preview-modal-market',
  templateUrl: './preview-modal-market.component.html',
  styleUrls: ['./preview-modal-market.component.scss']
})
export class PreviewModalMarketComponent implements OnInit {

  marketPreview$: Observable<MarketPreview[]>;

  displayedColumns = [
    'region', 'businessUnit', 'originator', 'supplier', 'product',
    'projectName', 'projectId', "hasPOC", "hasCompliance", 'ndaDate', 'pocDate',
  ];// 'postPOC'

  getUnicodeFlagIcon = getUnicodeFlagIcon;
  getName = getName;

  constructor(
    private store: Store<State>,
    @Inject(MAT_DIALOG_DATA) public data: MarketPreview) { }

  ngOnInit() {
    this.marketPreview$ = this.store.select(selectMarketPreview);
  }

  sort(sort: Sort) {
    this.store.dispatch(sortMarketPreview({ sort }));
  }

  download(preview: MarketPreview[]) {
    this.store.dispatch(exportMarketPreview({ preview }));
  }
}
