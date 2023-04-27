import { isEmpty } from 'lodash';
import { Component, OnInit, Inject, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FilterService } from '@shared/filter-service';
import { Store } from '@ngrx/store';
import { getNames } from 'country-list';
import { ApiService } from '@services/api/api.service';

@Component({
  selector: 'filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterModalComponent implements OnInit {
  countryList = getNames();
  taxonomies: any[] = [];

  filteredData = {
    taxonomy: this.taxonomies,
    productTags: ['Artificial Intelligence', 'Machine Learning', 'Data Extraction'],
    erqComplete: [],
    erqComplaint: [],
    contractInPlace: [],
    erqLastUpdated: [`Recently updated ✪`, 'Updated in last 28 days', 'Updated in last 6 months'],
    fisWorkedWith: ['Banking - Tier 1', 'Banking - Tier 2', 'Banking - Tier 3', 'Building societies', 'Credit Unions', 'Insurance', 'Wealth Management', 'Life Assurance', 'Asset Management'],
    countryOperatingIn: ['United Kingdom', 'United States of America', 'Canada', 'European Union'],
    hostingProvider: ['AWS', 'Azure', 'Google', 'IBM', 'Other'],
    geolocation: [...this.countryList.sort((a, b) => a.localeCompare(b))],
    hostProvider: [],
    accreditation: ['Received awards'], // , 'Involved in accelerator programs'],
    likes: [],
    companyAge: ['Less than 1 year', '1-3 years', '3-5 years', '5-10 years', 'More than 10 years'],
    fundingRound: ['Angel', 'Business Plan Competition', 'Bridge', 'Convertible Note', 'Corporate Minority', 'Crowdfunding', 'Debt', 'Grant', 'Growth Equity', 'Incubator', 'Line of Credit', 'Loan', 'Mezzanine', 'Pre-Seed', 'Private Equity', 'Seed', 'Seed VC', 'Series A', 'Series B', 'Seed C', 'Seed D', 'Seed E', 'Seed F', 'Seed G', 'Seed H', 'Undisclosed', 'Venture Capital'],
    useCases: [],
    companyDiversity: ['Diverse founding members', 'Diverse board members']
  };
  outputFilteredData = {
    taxonomy: [],
    productTags: [],
    erqComplete: [],
    erqComplaint: [],
    erqLastUpdated: [],
    contractInPlace: [],
    fisWorkedWith: [],
    countryOperatingIn: [],
    hostingProvider: [],
    geolocation: [],
    hostProvider: [],
    accreditation: [],
    companyAge: [],
    fundingRound: [],
    useCases: [],
    companyDiversity: []
  };
  expandedTabs: {} = {};
  resultFilteredData = {};
  allData = [];
  passedData = [];
  resultText: string | number;
  slidersRefresh: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    public dialogRef: MatDialogRef<FilterModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private filterService: FilterService,
    private apiService: ApiService,
    private store: Store
  ) {
    this.dialogRef.afterOpened().subscribe(() => this.slidersRefresh.emit());
  }

  ngOnInit(): void {
    this.filterService.filterOverview.subscribe(data => {
      this.outputFilteredData = { ...data.outputFilteredData };
      this.resultFilteredData = { ...data.resultFilteredData };
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
        this.passedData = this.filterService.setFilteredData(this.allData, this.resultFilteredData);
        this.resultText = this.passedData.length;
      } else {
        this.resultText = '';
      }
    });
    this.getTaxonomies();
  }

  getTaxonomies() {
    this.apiService.getSupplierTaxonomyTags().subscribe((res) => {
      this.taxonomies = res.body;
    });
  }

  outputSelectedItems(val: any) {
    this.outputFilteredData[val.column] = val.items;

    for (const [key1, value1] of Object.entries(this.filteredData)) {
      for (const [key2, value2] of Object.entries(this.outputFilteredData)) {
        if (key1 === key2) {
          if (Array.isArray(value2)) {
            this.resultFilteredData[key1] = (value2 as any[]).map(v => v.name);
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
    for (const [key, value] of Object.entries(this.outputFilteredData)) {
      this.outputFilteredData[key] = [];
    }
    this.filterService.attachData({
      sent: true,
      outputFilteredData: {
        taxonomy: [],
        productTags: [],
        productRating: [],
        erqComplete: [],
        erqRating: [],
        contractInPlace: [],
        fisWorkedWith: [],
        geolocation: [],
        hostProvider: [],
        accreditation: [],
        likes: [],
        companyAge: [],
        fundingRound: [],
        useCases: [],
        companyDiversity: []
      },
      resultFilteredData: {}
    });
    this.passedData = this.filterService.setFiltereMarketplaceData(this.allData, {});
    this.resultText = '';
  }

  onClickViewResults() {
    this.filterService.attachData({ sent: true, outputFilteredData: this.outputFilteredData, resultFilteredData: this.resultFilteredData });

    this.dialogRef.close(this.resultFilteredData);
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

  getFilters() {
    let filters: any[] = [];
    Object.keys(this.outputFilteredData).forEach((key) => {
      const value = this.outputFilteredData[key];

      if (value?.length) {
        filters = filters.concat(value.map((item) => ({
          name: key,
          value: item.name,
          title: key === 'taxonomy' ? item.title : item.name
        })));
      }
    });

    return filters;
  }

  onRemoveFilter(filter: { name: string, value: string }) {
    console.log('removing', filter);
    this.resultFilteredData = {
      ...this.resultFilteredData,
      [filter.name]: this.resultFilteredData[filter.name]?.filter((item) => item !== filter.value)
    };

    this.outputFilteredData = {
      ...this.outputFilteredData,
      [filter.name]: this.outputFilteredData[filter.name]?.filter((item) => item.name !== filter.value)
    };
    this.filterService.attachData({
      sent: false,
      outputFilteredData: this.outputFilteredData,
      resultFilteredData: this.resultFilteredData
    });
  }
}
