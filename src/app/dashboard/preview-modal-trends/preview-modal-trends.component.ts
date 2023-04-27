import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TrendsPreview } from '../store/dashboard.model';
import { State } from 'src/app/store';
import { Sort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectTrendsPreview } from '../store/dashboard.selectors';
import { exportTrendsPreview, sortTrendsPreview } from '../store/dashboard.actions';

@Component({
  selector: 'app-preview-modal-trends',
  templateUrl: './preview-modal-trends.component.html',
  styleUrls: ['./preview-modal-trends.component.scss']
})
export class PreviewModalTrendsComponent implements OnInit {

  trendsPreview$: Observable<TrendsPreview[]>;

  displayedColumns = [
    'businessUnit',
    'region',
    'projectName',
    'projectId',
    'supplier',
    'haveNDA',
    'ndaDate',
    'havePOC',
    //'business1',
    //'business2',
    //'procurment2',
    'hasSoc2',
    'hasISO27001',
    'hasCyberEssentials',
    'hasCyberEssentialsPlus',
    'allSecurityQuestions',
  ];

  constructor(
    private store: Store<State>,
    @Inject(MAT_DIALOG_DATA) public data: TrendsPreview) { }

  ngOnInit() {
    this.trendsPreview$ = this.store.select(selectTrendsPreview);
  }

  sort(sort: Sort) {
    this.store.dispatch(sortTrendsPreview({ sort }));
  }

  download(preview: TrendsPreview[]) {
    this.store.dispatch(exportTrendsPreview({ preview }));
  }
}
