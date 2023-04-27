
import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {OuterMarketTableModel} from '../../../outerMarket.models';
import {Store} from '@ngrx/store';
import {State} from '../../../store/index.reducer';
import * as OuterMarketActions from '../../../store/index.actions';
import {Observable} from 'rxjs';

@Component({
  selector: 'searches-preview',
  templateUrl: './searches-preview.component.html',
  styleUrls: ['./searches-preview.component.scss']
})
export class SearchesPreviewComponent implements OnInit {

  constructor(
    private store: Store<State>
  ) {}

  loading: boolean = false;
  searches: []

  @Input() searchedColumn: string;
  @Output() onSubmitClickedValue = new EventEmitter<string>();
  @Output() onInitSendOmSearchData = new EventEmitter<string[]>();

  ngOnInit(): void {
    this.store.dispatch(OuterMarketActions.loadSearchesPreview())
    this.store.select(state => state).subscribe(data => {

      if (this.searchedColumn == 'company') {
        this.searches = (data as any).outerMarket.preview.companies || []
      } else {
        this.searches = (data as any).outerMarket.preview.all || []
      }

      this.onInitSendOmSearchData.emit(this.searches)
      // this.loading = true

      // setTimeout(() => {
      //   this.loading = false
      // }, 500)
    });
  }

  onClickSetText(text: string) {
    this.onSubmitClickedValue.emit(text);
  }

}
