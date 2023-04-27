import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Store } from '@ngrx/store';
import { State } from '../../store/editTables/editTables.reducer';
import * as editTableActions from '../../store/editTables/editTables.actions';
import * as editTableSelectors from '../../store/editTables/editTables.selector';
import { filter, switchMap, take, tap } from 'rxjs/operators';
import { PopUpService } from '../../../shared/pop-up-service';
import { Types } from '../+edit-tables-page/partials/simple-table/simple-table.component';

@Component({
  selector: 'edit-tables',
  templateUrl: './edit-tables.component.html',
  styleUrls: ['./edit-tables.component.scss']
})
export class EditTablesComponent implements OnInit {

  constructor(
    private popUpService: PopUpService,
    private store: Store<State>
  ) {

    this.popUpService.popUpOverview.subscribe((data: any) => {
      if (data.success) {
        switch (data.type) {
          case Types.Tags:
            this.tags = [];
            this.loadings.loadingTags = true;
            setTimeout(() => {
              this.store.dispatch(editTableActions.loadTableTags({ table: Types.Tags }));
            }, 600);
            break;
          case Types.Frameworks:
            this.frameworks = [];
            this.loadings.loadingFrameworks = true;
            setTimeout(() => {
              this.store.dispatch(editTableActions.loadTableFrameworks({ table: Types.Frameworks }));
            }, 600);
            break;
          case Types.Solutions:
            this.solutions = [];
            this.loadings.loadingSolutions = true;
            setTimeout(() => {
              this.store.dispatch(editTableActions.loadTableSolutions({ table: Types.Solutions }));
            }, 600);
            break;
          case Types.Taxonomies:
            this.taxonomies = [];
            this.loadings.loadingTaxonomies = true;
            setTimeout(() => {
              this.store.dispatch(editTableActions.loadTableTaxonomies({ table: Types.Taxonomies }));
            }, 600);
            break;
        }

        this.store.select(state => state).subscribe((dataSub: any) => {
          if (dataSub && dataSub.admin) {
            setTimeout(() => {
              this.tags = (dataSub.admin as any).editTables.tags;
              this.frameworks = (dataSub.admin as any).editTables.frameworks;
              if ((dataSub.admin as any).editTables && (dataSub.admin as any).editTables.solutions && (dataSub.admin as any).editTables.solutions.length > 0) {
                const arrayForSort = [...(dataSub.admin as any).editTables.solutions];
                const sorted = arrayForSort.sort((a: any, b: any) => a.type.localeCompare(b.type));
                this.solutions = sorted && sorted.length > 0 ? this.groupByPropDesc(sorted, 'type') : [];
              } else {
                this.solutions = [];
              }
              this.taxonomies = (dataSub.admin as any).editTables.taxonomies;
              this.loadings.loadingTags = false;
              this.loadings.loadingFrameworks = false;
              this.loadings.loadingSolutions = false;
              this.loadings.loadingTaxonomies = false;

            }, 1600);
          }
        });
      } else if (data.success === false) {

      } else {
      }
    });

  }

  titles = [
    { title: 'Product tags', subTitle: 'Product tags (up to 3)' }
  ];

  tags: [];
  solutions: {}[];
  taxonomies: {}[];
  frameworks: [];
  loadings = {
    loadingTags: false,
    loadingSolutions: false,
    loadingTaxonomies: false,
    loadingFrameworks: false
  };

  ngOnInit(): void {

    this.store.dispatch(editTableActions.loadTableTags({ table: Types.Tags }));
    this.store.dispatch(editTableActions.loadTableFrameworks({ table: Types.Frameworks }));
    this.store.dispatch(editTableActions.loadTableSolutions({ table: Types.Solutions }));
    this.store.dispatch(editTableActions.loadTableTaxonomies({ table: Types.Taxonomies }));

    this.store.select(editTableSelectors.editTablesTagsLoading);
    this.store.select(editTableSelectors.editTablesLoaded)
      .pipe(tap(loaded => !loaded && this.store.dispatch(editTableActions.loadTableTags({ table: Types.Tags }))))
      .pipe(filter(loaded => !!loaded), take(1))
      .pipe(switchMap(_ => this.store.select(editTableSelectors.selectTables)));
    this.store.select(editTableSelectors.editTablesLoaded);

    this.store.select(editTableSelectors.editTablesFrameworksLoading);
    this.store.select(editTableSelectors.editTablesLoaded)
      .pipe(tap(loaded => !loaded && this.store.dispatch(editTableActions.loadTableFrameworks({ table: Types.Frameworks }))))
      .pipe(filter(loaded => !!loaded), take(1))
      .pipe(switchMap(_ => this.store.select(editTableSelectors.selectTables)));
    this.store.select(editTableSelectors.editTablesLoaded);

    this.store.select(editTableSelectors.editTablesSolutionsLoading);
    this.store.select(editTableSelectors.editTablesLoaded)
      .pipe(tap(loaded => !loaded && this.store.dispatch(editTableActions.loadTableSolutions({ table: Types.Solutions }))))
      .pipe(filter(loaded => !!loaded), take(1))
      .pipe(switchMap(_ => this.store.select(editTableSelectors.selectTables)));
    this.store.select(editTableSelectors.editTablesLoaded);

    this.store.select(editTableSelectors.editTablesTaxonomiesLoading);
    this.store.select(editTableSelectors.editTablesLoaded)
      .pipe(tap(loaded => !loaded && this.store.dispatch(editTableActions.loadTableTaxonomies({ table: Types.Taxonomies }))))
      .pipe(filter(loaded => !!loaded), take(1))
      .pipe(switchMap(_ => this.store.select(editTableSelectors.selectTables)));
    this.store.select(editTableSelectors.editTablesLoaded);

    this.store.select(state => state).subscribe((data: any) => {
      if (data && data.admin) {
        this.tags = (data.admin as any).editTables.tags;
        this.frameworks = (data.admin as any).editTables.frameworks;
        if ((data.admin as any).editTables && (data.admin as any).editTables.solutions && (data.admin as any).editTables.solutions.length > 0) {
          const arrayForSort = [...(data.admin as any).editTables.solutions];
          const sorted = arrayForSort.sort((a: any, b: any) => a.type.localeCompare(b.type));
          this.solutions = this.groupByPropDesc(sorted, 'type');
        } else {
          this.solutions = [];
        }
        this.taxonomies = (data.admin as any).editTables.taxonomies;
      }
    });
  }

  private groupByPropDesc = (xs, key) => {
    const items = xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});

    const keys = Object.keys(items);

    // Sort the keys in descending order
    keys.sort((a: any, b: any) => b - a);
    const arr = [];

    // Iterate through the array of keys and access the corresponding object properties
    for (const k of keys) {
      arr.push({
        key: k,
        values: items[k]
      });
    }
    return arr;
  }

}
