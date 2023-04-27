import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { State } from 'src/app/store';
import { exportTechnologyPreview, sortTechnologyPreview } from '../store/dashboard.actions';
import { TechnologyPreview } from '../store/dashboard.model';
import { selectTechnologyPreview } from '../store/dashboard.selectors';

@Component({
  selector: 'app-preview-modal-technology',
  templateUrl: './preview-modal-technology.component.html',
  styleUrls: ['./preview-modal-technology.component.scss']
})
export class PreviewModalTechnologyComponent implements OnInit {

  technologyPreview$: Observable<TechnologyPreview[]>;

  displayedColumns = [
    'functionality',
    'compliance',
    'POC',
    'originator',
    'projectName',
    //'region',
    //'businessUnit',
    'ndaDate',
    'pocDate'
  ];

  constructor(
    private store: Store<State>,
    @Inject(MAT_DIALOG_DATA) public data: TechnologyPreview) { }

  ngOnInit() {
    this.technologyPreview$ = this.store.select(selectTechnologyPreview);
  }

  sort(sort: Sort) {
    this.store.dispatch(sortTechnologyPreview({ sort }));
  }

  download(preview: TechnologyPreview[]) {
    this.store.dispatch(exportTechnologyPreview({ preview }));
  }
}
