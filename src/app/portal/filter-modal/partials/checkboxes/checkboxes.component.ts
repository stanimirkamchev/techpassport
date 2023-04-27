import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ViewChildren, QueryList, ElementRef, HostListener, ChangeDetectorRef } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'checkboxes',
  templateUrl: './checkboxes.component.html',
  styleUrls: ['./checkboxes.component.scss']
})
export class CheckboxesComponent implements OnInit {
  constructor(
    private cd: ChangeDetectorRef,
  ) { }

  public selectedItems: any[] = [];
  isReadMore = false;
  isLoadingData = false;
  notFoundData = false;
  mainCheckbox = false;
  unmutable = [];
  copiedDataItems = [];
  checkedArray: boolean[];
  chunkSize = 100;
  filterValue = '';
  filteredData = null;
  dataLength = 0;
  isMainCheckboxChecked = false;

  @Input() data: [] | { name: string, isChecked: boolean }[] | any;
  @Input() searchedColumn: string;
  @Input() outputFilteredData: {};
  @Output() outputSelectedItems = new EventEmitter<{}>();

  @ViewChild('selectAll') selectAll: MatCheckbox;
  @ViewChild('select') select: MatCheckbox;
  @ViewChild('input') input: ElementRef;
  @ViewChild('allCheckboxes') allCheckboxes: ElementRef;
  @ViewChildren('checkboxes') checkboxes: QueryList<ElementRef>;

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.onClearSearch();
    (document.activeElement as any).blur();
    (document.querySelector('body') as any).click();
  }

  ngOnInit(): void {
    this.data = this.data.map(obj => ({ name: obj, isChecked: false }));
    this.unmutable = [...this.data];
    if (this.outputFilteredData[this.searchedColumn] !== undefined) {
      this.outputSelectedItems.emit({ column: this.searchedColumn, items: this.outputFilteredData[this.searchedColumn] });

      this.data = this.data.map(a => {
        const exists = this.outputFilteredData[this.searchedColumn].find(b => a.name === b.name);
        return exists ? (a.isChecked = exists.isChecked, a) : a;
      });

      if (this.data.filter(it => it.isChecked).length === this.data.length) {
        this.mainCheckbox = true;
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

  onChangeSelectAll(checked: boolean) {
    this.isMainCheckboxChecked = checked;
    if (checked) {
      if (this.filterValue.length > 0) {
        this.selectedItems = this.filteredData.map(obj => ({ name: obj.name, isChecked: true }));
        this.data.map(i => i.isChecked = true);
      } else {
        this.selectedItems = this.copiedDataItems.map(obj => ({ name: obj.name, isChecked: true }));
        this.data.map(i => i.isChecked = true);
      }
    } else {
      this.selectedItems = this.copiedDataItems.map(obj => ({ name: obj.name, isChecked: false }));
      this.data.map(i => i.isChecked = false);
    }

    this.outputSelectedItems.emit({ column: this.searchedColumn, items: this.selectedItems.filter(i => i.isChecked) });
  }

  onClearSearch() {
    this.input.nativeElement.value = null;
    this.data = this.copiedDataItems;
    this.dataLength = this.copiedDataItems.length;
    this.isReadMore = false;
    this.selectedItems = this.copiedDataItems.map(obj => ({ name: obj.name, isChecked: false }));
    this.onChangeSelectAll(false);
    this.selectAll.checked = false;
  }

  search(event: Event): string[] {
    const data = (this.copiedDataItems as any);
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    const filteredData = data.filter(i => i.name.trim().toLowerCase().startsWith(filterValue));
    this.filterValue = filterValue;
    this.filteredData = filteredData;

    if (filteredData.length === 0) {
      this.notFoundData = true;
      this.dataLength = this.copiedDataItems.length;
    } else {
      this.notFoundData = false;
      this.dataLength = filteredData.length;
      this.chunkSize = 0;
    }

    if (filterValue.length === 0) {
      this.isLoadingData = true;
      this.onClearSearch();

      setTimeout(() => {
        this.isLoadingData = false;
        this.cd.detectChanges();
      }, 2000);
      return this.data = this.copiedDataItems;
    }
    this.isLoadingData = false;
    return this.data = filteredData;
  }

  showText() {
    this.isReadMore = !this.isReadMore;
    this.onScroll();
  }

  scrollToBottom(): void {
    try {
      this.isReadMore = true;
      this.onScroll();
      const interval = setInterval(() => {
        this.allCheckboxes.nativeElement.scrollTop = this.allCheckboxes.nativeElement.scrollHeight;
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

