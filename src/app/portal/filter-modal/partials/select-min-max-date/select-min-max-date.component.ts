import { Component, OnInit, Input, Output, EventEmitter, ElementRef, QueryList, ViewChildren, ViewChild } from '@angular/core';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'select-min-max-date',
  templateUrl: './select-min-max-date.component.html',
  styleUrls: ['./select-min-max-date.component.scss'],
})
export class SelectMinMaxDateComponent implements OnInit {

  constructor(private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('en-GB');
  }

  minDate: Date;
  maxDate: Date;
  selectedMinVal: Date | null;
  selectedMaxVal: Date | null;
  dates: any[] = [];

  @Input() data: [] | string[];
  @Input() searchedColumn: string;
  @Input() outputFilteredData: {};
  @Output() outputSelectedItems = new EventEmitter<{}>();

  @ViewChildren('inputs') inputs: QueryList<ElementRef>;
  @ViewChild('minInput') minInput: ElementRef;
  @ViewChild('picker1') picker1: ElementRef;

  ngOnInit(): void {
    if (this.outputFilteredData[this.searchedColumn] !== undefined) {
      this.selectedMinVal = this.outputFilteredData[this.searchedColumn].min ? this.outputFilteredData[this.searchedColumn].min : null;
      this.selectedMaxVal = this.outputFilteredData[this.searchedColumn].max ? this.outputFilteredData[this.searchedColumn].max : null;

      if (this.outputFilteredData[this.searchedColumn].min !== null || this.outputFilteredData[this.searchedColumn].max !== null) {
        this.outputSelectedItems.emit({ column: this.searchedColumn, items: { min: this.selectedMinVal, max: this.selectedMaxVal } });
      }
    }

    this.data.forEach((i: string) => {
      let date = i.split('.');
      if (date && date.length === 3) {
        this.dates.push(new Date(`${date[1]}.${date[0]}.${date[2]}`));
      } else {
        date = i.split('/');
        if (date && date.length === 3) {
          this.dates.push(new Date(`${date[1]}.${date[0]}.${date[2]}`));
        }
      }
    });

    this.dates.sort((a, b) => a - b);
    this.minDate = this.dates[0];
    this.maxDate = this.dates[this.dates.length - 1];
  }

  onChangeDateMin(event) {
    this.selectedMinVal = event.value;
    this.outputSelectedItems.emit({ column: this.searchedColumn, items: { min: this.selectedMinVal, max: this.selectedMaxVal || null } });
  }
  onChangeDateMax(event) {
    this.selectedMaxVal = event.value;
    this.outputSelectedItems.emit({ column: this.searchedColumn, items: { min: this.selectedMinVal || null, max: this.selectedMaxVal } });
  }
}
