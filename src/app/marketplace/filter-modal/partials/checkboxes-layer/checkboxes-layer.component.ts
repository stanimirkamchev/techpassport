import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ViewChildren, QueryList, ElementRef, HostListener, ChangeDetectorRef } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'checkboxes-layer',
  templateUrl: './checkboxes-layer.component.html',
  styleUrls: ['./checkboxes-layer.component.scss']
})
export class CheckboxesLayerComponent implements OnInit {
  constructor(
    private cd: ChangeDetectorRef,
  ) { }

  public selectedItems: any[] = [];
  isReadMore = false;
  copiedDataItems = [];
  checkedArray: boolean[];
  chunkSize = 100;
  filterValue = '';
  filteredData = null;
  dataLength = 0;
  isMainCheckboxChecked = false;

  @Input() title: string;
  @Input() data: [] | any;
  @Input() searchedColumn: string;
  @Input() outputFilteredData: {};
  @Output() outputSelectedItems = new EventEmitter<{}>();

  ngOnInit(): void {
    this.data = this.data.map(obj => ({ name: obj.label, isChecked: false, children: obj.children.map(c => ({ name: c.label, isChecked: false})) }));
    if (this.outputFilteredData[this.searchedColumn] !== undefined) {
      this.outputSelectedItems.emit({ column: this.searchedColumn, items: this.outputFilteredData[this.searchedColumn] });

      // this.data = this.data.map(a => {
      //   const exists = this.outputFilteredData[this.searchedColumn].find(b => a.name === b.name);
      //   return exists ? (a.isChecked = exists.isChecked, a) : a;
      // });

      if (this.data.filter(it => it.isChecked).length === this.data.length) {
        //checked all
      }
    }

    this.copiedDataItems = this.copiedData(this.data.sort((a: any, b: any) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())));
    this.selectedItems = this.copiedDataItems;

    const notSlicedArrays = ['taxonomy', 'latestFundingRound'];
    if (!notSlicedArrays.includes(this.searchedColumn)) {
      this.data = this.data.slice(0, this.chunkSize);
    }

    this.dataLength = this.copiedDataItems.length;
  }

  onCheckboxChange(checked: boolean, name: string) {
    const idx = this.selectedItems.findIndex(object => object.name === name);
    this.selectedItems[idx].isChecked = checked;
    this.outputSelectedItems.emit({ column: this.searchedColumn, items: this.selectedItems.filter(i => i.isChecked) });
  }

  copiedData = (item) => cloneDeep(item);

  showText() {
    this.isReadMore = !this.isReadMore;
    this.onScroll();
  }

  scrollToBottom(): void {
    try {
      this.isReadMore = true;
      this.onScroll();
      const interval = setInterval(() => {
        //this.allCheckboxes.nativeElement.scrollTop = this.allCheckboxes.nativeElement.scrollHeight;
        this.onScroll();
      }, 5);
      if (this.chunkSize > this.copiedDataItems.length) { // TODO
        clearInterval(interval);
      }
    } catch (err) { }
  }

  onScroll() {
    let data = null;
    this.chunkSize += 100;

    if (this.filterValue.length > 0) {
      data = this.filteredData;
    } else {
      data = this.copiedDataItems;
    }

    if (this.chunkSize > data.length && this.chunkSize < data.length + 100) {
      this.chunkSize += data.length - this.chunkSize;
    }

    this.addItems(data);

  }

  addItems(data) {
    if (this.chunkSize <= data.length) {
      this.data = [];
      for (let i = 0; i < this.chunkSize; ++i) {
        if (this.isMainCheckboxChecked) {
          this.data.map(e => e.isChecked = true);
        }
        this.data.push(data[i]);
      }
    }

    if (this.isMainCheckboxChecked) {
      this.data[this.data.length - 1].isChecked = true;
    }
  }
}

