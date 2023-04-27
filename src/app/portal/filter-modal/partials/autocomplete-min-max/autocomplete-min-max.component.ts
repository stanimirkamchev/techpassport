
import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, ElementRef, QueryList, ViewChild  } from '@angular/core';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'autocomplete-min-max',
  templateUrl: './autocomplete-min-max.component.html',
  styleUrls: ['./autocomplete-min-max.component.scss']
})
export class AutocompleteMinMaxComponent implements OnInit {

  constructor(
  ) { }

  selectedMin: string | number;
  selectedMax: string | number;
  sortedMin: number[];
  sortedMax: number[];


  @Input() data: number[];
  @Input() searchedColumn: string;
  @Input() clearSelected: boolean;
  @Input() outputFilteredData: {};
  @Output() outputSelectedItems = new EventEmitter<{}>();

  @ViewChild('selectMin') selectMin: any;
  @ViewChild('inputMin') inputMin: ElementRef<HTMLInputElement>;
  @ViewChild('selectMax') selectMax: any;
  @ViewChild('inputMax') inputMax: ElementRef<HTMLInputElement>;

  @ViewChildren('selects') selects: QueryList<ElementRef>;

  ngOnInit(): void {
    if (this.outputFilteredData[this.searchedColumn] !== undefined) {
      this.selectedMin = this.outputFilteredData[this.searchedColumn].min ? this.outputFilteredData[this.searchedColumn].min : null;
      this.selectedMax = this.outputFilteredData[this.searchedColumn].max ? this.outputFilteredData[this.searchedColumn].max : null;

      if (this.outputFilteredData[this.searchedColumn].min && this.outputFilteredData[this.searchedColumn].max) {
        this.outputSelectedItems.emit({ column: this.searchedColumn, items: { min: this.selectedMin, max: this.selectedMax } });
      }
    }

    this.sortedMin = this.data.filter(i => i !== null).sort((a: number, b: number) => a - b);
    this.sortedMax = this.data.filter(i => i !== null).sort((a: number, b: number) => b - a);
  }

  ngAfterViewInit(): void {
    const selectorMin = document.querySelector('.number-input-min');
    if (selectorMin) {
      selectorMin.addEventListener('keydown', (event) => {
        if ((event as any).which === 38 || (event as any).which === 40) {
          this.selectMin.focus();
          event.preventDefault();
        }
      });
    }

    const selectorMax = document.querySelector('.number-input-max');
    if (selectorMax) {
      selectorMax.addEventListener('keydown', (event) => {
        if ((event as any).which === 38 || (event as any).which === 40) {
          this.selectMax.focus();
          event.preventDefault();
        }
      });
    }
  }

  ngOnChanges(changes: any) {
    if (changes.clearSelected && changes.clearSelected?.previousValue !== changes.clearSelected?.currentValue) {
      if (this.clearSelected) {
        this.selects.forEach((element) => (element as any).options.forEach((data: MatOption) => data.deselect()));
      }
    }
  }

  onChangeSelect() {
    this.outputSelectedItems.emit({ column: this.searchedColumn, items: { min: this.selectedMin, max: this.selectedMax } });
  }

  openPanelMin() {
    this.selectMin.open();
    this.selectMax.close();
    this.sortedMin = this.data.filter(i => i !== null).sort((a: number, b: number) => a - b)
  }


  openPanelMax() {
    this.selectMin.close();
    this.selectMax.open();
    this.sortedMax = this.data.filter(i => i !== null).sort((a: number, b: number) => b - a);
  }

  searchMin() {
    const items:string[] =  this.data.map(i => String(i))
    const sorted = items.filter(i => i.includes(this.inputMin.nativeElement.value))
    this.sortedMin = this.inputMin.nativeElement.value.length > 0 ?
                  sorted.map(i => Number(i)) :
                  this.data.filter(i => i !== null).sort((a: number, b: number) => a - b)

    this.outputSelectedItems.emit({ column: this.searchedColumn, items: { min: Number(this.inputMin.nativeElement.value), max: Number(this.inputMax.nativeElement.value) } });

  }

  searchMax() {
    const items:string[] =  this.data.map(i => String(i))
    const sorted = items.filter(i => i.includes(this.inputMax.nativeElement.value))
    this.sortedMax = this.inputMax.nativeElement.value.length > 0 ?
                  sorted.map(i => Number(i)) :
                  this.data.filter(i => i !== null).sort((a: number, b: number) => b - a);

    this.outputSelectedItems.emit({ column: this.searchedColumn, items: { min: Number(this.inputMin.nativeElement.value), max: Number(this.inputMax.nativeElement.value) } });

  }

}
