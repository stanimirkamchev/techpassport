import { isArray, isEmpty } from 'lodash';
import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FilterService } from '@shared/filter-service';
import { Store } from '@ngrx/store';
import * as outerMarketSelectors from './../+outer-market-page/store/index';

@Component({
  selector: 'portal-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<FilterModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private filterService: FilterService,
    private store: Store
  ) {

    this.store.select(outerMarketSelectors.selectOuterMarketDataState).subscribe(resData => {
      this.allData = resData.data;

      if (this.allData) {
        for (const item of this.columnsToFilter) {
          this.filteredData[item].push(...new Set(this.allData.map(i => i[item])));
        }

        for (const [key, value] of Object.entries(this.filteredData)) {
          this.filteredData[key] = [];
          if (value.length > 0) {
            value.map((item: any) => {
              if (isArray(item)) {
                if (item.length > 0) {
                  // this.filteredData[key].push(...new Set(item.flat()));
                }
              } else {
                if (item !== null && item !== '' && item !== '-') {
                  this.filteredData[key].push(item);
                }
              }
            });
          }
        }
        for (const [key, value] of Object.entries(this.filteredData)) {
          this.filteredData[key] = [...new Set(this.filteredData[key])];
        }
      }
    });
  }

  columnsToFilter: string[] = ['taxonomy', 'company', 'country', 'totalFunding', 'latestFundingRound', 'latestFundingDate', 'investors', 'latestValuation', 'acquirers'];
  filteredData = {
    taxonomy: [],
    company: [],
    country: [],
    totalFunding: [],
    latestFundingRound: [],
    latestFundingDate: [],
    investors: [],
    latestValuation: [],
    acquirers: []
  };
  outputFilteredData = {
    taxonomy: [],
    company: [],
    country: [],
    totalFunding: [],
    latestFundingRound: [],
    latestFundingDate: [],
    investors: [],
    latestValuation: [],
    acquirers: []
  };
  outputtedFilteredData: {};
  expandedTabs: {} = {};
  resultFilteredData = {};
  allData = [];
  passedData = [];
  resultText: string | number;
  clearFilters = false;

  ngOnInit(): void {
    this.filterService.filterOverview.subscribe(data => {
      this.outputtedFilteredData = data.outputFilteredData;
      let isEmptyObject = true;

      if (!isEmpty(data.outputFilteredData)) {
        for (const [key, value] of Object.entries(data.outputFilteredData)) {
          if (!isEmpty(value)) {
            this.expandedTabs[key] = true;
          } else {
            this.expandedTabs[key] = false;
          }
        }
      }

      if (!isEmpty(this.resultFilteredData)) {
        for (const [key1, value1] of Object.entries(this.resultFilteredData)) {
          if (!isEmpty(value1)) {
            isEmptyObject = false;
          }
        }
      }

      if (!isEmptyObject) {
        this.passedData = this.filterService.setFilteredData(this.allData, data.resultFilteredData);
        this.resultText = this.passedData.length;
      } else {
        this.resultText = '';
      }
    });
  }

  outputSelectedItems(val: any) {
    Object.keys(this.outputFilteredData).forEach((col: string) => {
      if (col === val.column) {
        this.outputFilteredData[val.column] = val.items;
      }
    });
    for (const [key1, value1] of Object.entries(this.filteredData)) {
      for (const [key2, value2] of Object.entries(this.outputFilteredData)) {
        if (key1 === key2) {
          if (Array.isArray(value2)) {
            this.resultFilteredData[key1] = value1.filter(r => value2.map(v => v.name).indexOf(r) >= 0);
          } else {
            if (key1 === 'latestFundingDate') {
              this.minMaxDateHelper(key1, (value2 as any).min, (value2 as any).max, value1);
            } else {
              value1.filter(a => a).forEach(i => this.minMaxHelper(key1, (value2 as any).min, (value2 as any).max, value1));
            }
          }
        }

      }
    }
    let isEmptyObject = true;
    if (!isEmpty(this.resultFilteredData)) {
      for (const [key1, value1] of Object.entries(this.resultFilteredData)) {
        if (!isEmpty(value1)) {
          isEmptyObject = false;
        }
      }
    }

    if (!isEmptyObject) {
      this.passedData = this.filterService.setFilteredData(this.allData, this.resultFilteredData);
      this.resultText = this.passedData.length;
    } else {
      this.resultText = '';
    }

  }

  onClickClearFilters() {
    this.clearFilters = true;
    for (const [key, value] of Object.entries(this.outputFilteredData)) {
      this.outputFilteredData[key] = [];
    }
    this.filterService.attachData({
      sent: true,
      outputFilteredData: {
        taxonomy: [],
        company: [],
        country: [],
        totalFunding: [],
        latestFundingRound: [],
        latestFundingDate: [],
        investors: [],
        latestValuation: [],
        acquirers: []
      },
      resultFilteredData: {}
    });
    this.passedData = this.filterService.setFilteredData(this.allData, {});
    this.resultText = '';
    setTimeout(() => { this.clearFilters = false; }, 200);
  }

  onClickViewResults() {
    this.filterService.attachData({ sent: true, outputFilteredData: this.outputFilteredData, resultFilteredData: this.resultFilteredData });
    this.cancel();
  }

  cancel() {
    this.dialogRef.close();
  }

  minMaxHelper(key, min, max, arr) {
    if (min && max) {
      this.resultFilteredData[key] = arr.filter(i => i >= min && i <= max);
    }
    else if (!min && !max) {
      this.resultFilteredData[key] = arr.filter(i => i <= max);
    }
    else if (!min && max) {
      this.resultFilteredData[key] = arr.filter(i => i <= max);
    }
    else if (min && !max) {
      this.resultFilteredData[key] = arr.filter(i => i >= min);
    }
    this.resultFilteredData[key] = this.resultFilteredData[key].filter(a => a);
  }

  minMaxDateHelper(key, min, max, arr) {
    const formatDate = (d) => {
      let date = d.split('.');
      if (date && date.length === 3) {
        return new Date(`${date[1]}.${date[0]}.${date[2]}`);
      } else {
        date = d.split('/');
        if (date && date.length === 3) {
          return new Date(`${date[1]}.${date[0]}.${date[2]}`);
        }
      }
    };
    if (min && max) {
      this.resultFilteredData[key] = arr.filter(i => formatDate(i) >= min && formatDate(i) <= max);
    }
    else if (!min && max) {
      this.resultFilteredData[key] = arr.filter(i => formatDate(i) <= max);
    }
    else if (min && !max) {
      this.resultFilteredData[key] = arr.filter(i => formatDate(i) >= min);
    }
  }

  isNumeric(val: any): boolean {
    return !(val instanceof Array) && (val - parseFloat(val) + 1) >= 0;
  }

}
