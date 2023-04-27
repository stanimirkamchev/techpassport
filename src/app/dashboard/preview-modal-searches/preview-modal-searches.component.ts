import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { State } from 'src/app/store';
import { exportSearchesPreview, sortSearchesPreview } from '../store/dashboard.actions';
import { SearchesPreview } from '../store/dashboard.model';
import { selectSearchesPreview } from '../store/dashboard.selectors';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';
import { getName } from 'country-list';


@Component({
  selector: 'app-preview-modal-searches',
  templateUrl: './preview-modal-searches.component.html',
  styleUrls: ['./preview-modal-searches.component.scss']
})
export class PreviewModalSearchesComponent implements OnInit {
  searchesPreview$: Observable<SearchesPreview[]>;

  displayedColumns = [
    'searchDate', 'country', 'functionality', 'productsFound',
    'suppliersFound', 'user'
  ];// 'haveConversation',// 'technology', 'haveNDA', 'havePOC', 

  getUnicodeFlagIcon = getUnicodeFlagIcon;
  getName = getName;


  constructor(
    private store: Store<State>,
    @Inject(MAT_DIALOG_DATA) public data: SearchesPreview) { }

  ngOnInit() {
    this.searchesPreview$ = this.store.select(selectSearchesPreview);
  }

  sort(sort: Sort) {
    this.store.dispatch(sortSearchesPreview({ sort }));
  }

  download(preview: SearchesPreview[]) {
    this.store.dispatch(exportSearchesPreview({ preview }));
  }
}
